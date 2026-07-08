import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppointmentsService {
  // Constantes da regra de negócio - facilita manutenção e testes
  private readonly SLOT_DURATION_HOURS = 1;
  private readonly OPENING_HOUR = 9;
  private readonly CLOSING_HOUR = 18; // último slot inicia às 17h
  private gatewayUrl: string;

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService
  ) {
    this.gatewayUrl = this.configService.get<string>('GATEWAY_URL') || 'http://localhost:4000';
  }

  // ---------- VALIDAÇÃO DE REGRA DE NEGÓCIO (CINTURÃO DE SEGURANÇA) ----------
  // Mesmo o DTO validando, revalidamos no service: defesa em profundidade.
  private assertBusinessHour(date: Date) {
    const now = new Date();
    if (date < now) {
      throw new BadRequestException('Não é possível agendar em uma data passada.');
    }

    const day = date.getDay();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    if (day === 0 || day === 6) {
      throw new BadRequestException(
        'Agendamentos não são permitidos aos finais de semana.',
      );
    }
    if (hour < this.OPENING_HOUR || hour >= this.CLOSING_HOUR) {
      throw new BadRequestException(
        `Horário fora do expediente (${this.OPENING_HOUR}h às ${this.CLOSING_HOUR}h).`,
      );
    }
    if (minutes !== 0) {
      throw new BadRequestException(
        'Agendamentos só podem começar em horas cheias.',
      );
    }
  }

  // ---------- VALIDAÇÃO DE ENTIDADES (GATEWAY) ----------
  private async validarEntidades(dto: CreateAppointmentDto, token: string) {
    if (!token) {
      throw new ForbiddenException('Token de autorização é obrigatório para validação de entidades.');
    }

    const headers = { Authorization: token };

    try {
      await Promise.all([
        firstValueFrom(this.httpService.get(`${this.gatewayUrl}/imoveis/${dto.id_imovel}`, { headers })),
        firstValueFrom(this.httpService.get(`${this.gatewayUrl}/locador/${dto.id_locador}`, { headers })),
        firstValueFrom(this.httpService.get(`${this.gatewayUrl}/locatarios/${dto.id_locatario}`, { headers }))
      ]);
    } catch (error: any) {
      console.error('Erro na validação de entidades:', error.message);
      throw new BadRequestException(
        'Falha ao criar o agendamento: Imóvel, Locador ou Locatário fornecido(s) não existe(m).'
      );
    }
  }

  // ---------- CRIAÇÃO ----------
  async create(dto: CreateAppointmentDto, token: string) {
    const appointmentDate = new Date(dto.data);
    this.assertBusinessHour(appointmentDate);

    // Valida os IDs externos via Gateway
    await this.validarEntidades(dto, token);

    return this.prisma.appointment.create({
      data: {
        id_locador: dto.id_locador,
        id_locatario: dto.id_locatario,
        id_imovel: dto.id_imovel,
        data: appointmentDate,
        tipo: dto.tipo,
        status: dto.status ?? AppointmentStatus.SCHEDULED,
      },
    });
  }

  // ---------- LISTAR ----------
  // Usuário comum vê só os próprios; admin vê todos.
  async findAll() {
    return this.prisma.appointment.findMany({
      orderBy: {
        data: 'asc',
      },
    });
  }

  // ---------- BUSCAR UM ----------
  async findOne(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id_agendamento: id },
    });
    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado.`);
    }
    return appointment;
  }

  // ---------- SLOTS DISPONÍVEIS ----------
  // Retorna todos os slots do dia marcando quais estão livres.
  async availableSlots(dateStr: string) {
    const date = new Date(`${dateStr}T00:00:00`);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Data inválida.');
    }

    const day = date.getDay();
    if (day === 0 || day === 6) {
      return { date: dateStr, weekend: true, slots: [] };
    }

    // Pega o intervalo do dia inteiro
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const booked = await this.prisma.appointment.findMany({
      where: {
        data: { gte: startOfDay, lte: endOfDay },
        status: { not: AppointmentStatus.CANCELED },
      },
      select: { data: true },
    });

    const bookedHours = new Set(booked.map((a) => a.data.getHours()));
    const now = new Date();

    const slots: { hour: string; startTime: string; available: boolean }[] = [];
    for (let h = this.OPENING_HOUR; h < this.CLOSING_HOUR; h++) {
      const slotTime = new Date(date);
      slotTime.setHours(h, 0, 0, 0);
      slots.push({
        hour: `${String(h).padStart(2, '0')}:00`,
        startTime: slotTime.toISOString(),
        available: !bookedHours.has(h) && slotTime > now,
      });
    }

    return { date: dateStr, weekend: false, slots };
  }

  // ---------- CANCELAR ----------
  async cancel(id: number) {
  return this.prisma.appointment.update({
    where: {
      id_agendamento: id,
    },
    data: {
      status: AppointmentStatus.CANCELED,
    },
  });
}

  // ---------- REMOVER (HARD DELETE) ----------
  async removeHard(id: number) {
    // Verifica se existe
    await this.findOne(id);

    return this.prisma.appointment.delete({
      where: {
        id_agendamento: id,
      },
    });
  }
}
