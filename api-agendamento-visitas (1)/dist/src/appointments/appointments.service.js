"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let AppointmentsService = class AppointmentsService {
    constructor(prisma, httpService, configService) {
        this.prisma = prisma;
        this.httpService = httpService;
        this.configService = configService;
        this.SLOT_DURATION_HOURS = 1;
        this.OPENING_HOUR = 9;
        this.CLOSING_HOUR = 18;
        this.gatewayUrl = this.configService.get('GATEWAY_URL') || 'http://localhost:4000';
    }
    assertBusinessHour(date) {
        const now = new Date();
        if (date < now) {
            throw new common_1.BadRequestException('Não é possível agendar em uma data passada.');
        }
        const day = date.getDay();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        if (day === 0 || day === 6) {
            throw new common_1.BadRequestException('Agendamentos não são permitidos aos finais de semana.');
        }
        if (hour < this.OPENING_HOUR || hour >= this.CLOSING_HOUR) {
            throw new common_1.BadRequestException(`Horário fora do expediente (${this.OPENING_HOUR}h às ${this.CLOSING_HOUR}h).`);
        }
        if (minutes !== 0) {
            throw new common_1.BadRequestException('Agendamentos só podem começar em horas cheias.');
        }
    }
    async validarEntidades(dto, token) {
        if (!token) {
            throw new common_1.ForbiddenException('Token de autorização é obrigatório para validação de entidades.');
        }
        const headers = { Authorization: token };
        try {
            await Promise.all([
                (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.gatewayUrl}/imoveis/${dto.id_imovel}`, { headers })),
                (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.gatewayUrl}/locador/${dto.id_locador}`, { headers })),
                (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.gatewayUrl}/locatarios/${dto.id_locatario}`, { headers }))
            ]);
        }
        catch (error) {
            console.error('Erro na validação de entidades:', error.message);
            throw new common_1.BadRequestException('Falha ao criar o agendamento: Imóvel, Locador ou Locatário fornecido(s) não existe(m).');
        }
    }
    async create(dto, token) {
        const appointmentDate = new Date(dto.data);
        this.assertBusinessHour(appointmentDate);
        await this.validarEntidades(dto, token);
        return this.prisma.appointment.create({
            data: {
                id_locador: dto.id_locador,
                id_locatario: dto.id_locatario,
                id_imovel: dto.id_imovel,
                data: appointmentDate,
                tipo: dto.tipo,
                status: dto.status ?? client_1.AppointmentStatus.SCHEDULED,
            },
        });
    }
    async findAll() {
        return this.prisma.appointment.findMany({
            orderBy: {
                data: 'asc',
            },
        });
    }
    async findOne(id) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id_agendamento: id },
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Agendamento com ID ${id} não encontrado.`);
        }
        return appointment;
    }
    async availableSlots(dateStr) {
        const date = new Date(`${dateStr}T00:00:00`);
        if (isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Data inválida.');
        }
        const day = date.getDay();
        if (day === 0 || day === 6) {
            return { date: dateStr, weekend: true, slots: [] };
        }
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const booked = await this.prisma.appointment.findMany({
            where: {
                data: { gte: startOfDay, lte: endOfDay },
                status: { not: client_1.AppointmentStatus.CANCELED },
            },
            select: { data: true },
        });
        const bookedHours = new Set(booked.map((a) => a.data.getHours()));
        const now = new Date();
        const slots = [];
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
    async cancel(id) {
        return this.prisma.appointment.update({
            where: {
                id_agendamento: id,
            },
            data: {
                status: client_1.AppointmentStatus.CANCELED,
            },
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService,
        config_1.ConfigService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map