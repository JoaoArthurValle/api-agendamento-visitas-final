import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class AppointmentsService {
    private prisma;
    private httpService;
    private configService;
    private readonly SLOT_DURATION_HOURS;
    private readonly OPENING_HOUR;
    private readonly CLOSING_HOUR;
    private gatewayUrl;
    constructor(prisma: PrismaService, httpService: HttpService, configService: ConfigService);
    private assertBusinessHour;
    private validarEntidades;
    create(dto: CreateAppointmentDto, token: string): Promise<{
        id_locador: number | null;
        id_locatario: number | null;
        id_imovel: number | null;
        data: Date;
        tipo: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        id_agendamento: number;
    }>;
    findAll(): Promise<{
        id_locador: number | null;
        id_locatario: number | null;
        id_imovel: number | null;
        data: Date;
        tipo: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        id_agendamento: number;
    }[]>;
    findOne(id: number): Promise<{
        id_locador: number | null;
        id_locatario: number | null;
        id_imovel: number | null;
        data: Date;
        tipo: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        id_agendamento: number;
    }>;
    availableSlots(dateStr: string): Promise<{
        date: string;
        weekend: boolean;
        slots: {
            hour: string;
            startTime: string;
            available: boolean;
        }[];
    }>;
    cancel(id: number): Promise<{
        id_locador: number | null;
        id_locatario: number | null;
        id_imovel: number | null;
        data: Date;
        tipo: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        createdAt: Date;
        updatedAt: Date;
        id_agendamento: number;
    }>;
}
