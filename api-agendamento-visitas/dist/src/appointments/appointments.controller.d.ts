import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
export declare class AppointmentsController {
    private appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(dto: CreateAppointmentDto, authHeader: string): Promise<{
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
    removeHard(id: number): Promise<{
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
