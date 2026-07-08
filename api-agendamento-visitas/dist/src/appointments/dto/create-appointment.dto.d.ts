import { AppointmentStatus } from '@prisma/client';
export declare class CreateAppointmentDto {
    id_locador?: number;
    id_locatario?: number;
    id_imovel?: number;
    data: string;
    tipo: string;
    status: AppointmentStatus;
}
