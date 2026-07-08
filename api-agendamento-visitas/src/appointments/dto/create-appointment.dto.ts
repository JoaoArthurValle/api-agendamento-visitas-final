import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  id_locador?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  id_locatario?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  id_imovel?: number;

  @ApiProperty({
    example: '2026-07-10T14:00:00.000Z',
  })
  @IsDateString()
  data!: string;

  @ApiProperty()
  @IsString()
  tipo!: string;

  @ApiProperty({
    enum: AppointmentStatus,
    required: true,
  })
  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus;
}