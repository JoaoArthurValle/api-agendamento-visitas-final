import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailableSlotsQueryDto } from './dto/available-slots-query.dto';
import { CurrentUser, CurrentUserType } from '../auth/current-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.USER, Role.ADMIN)
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto, @Headers('authorization') authHeader: string) {
    return this.appointmentsService.create(dto, authHeader);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

@Delete(':id')
cancel(@Param('id', ParseIntPipe) id: number) {
  return this.appointmentsService.cancel(id);
}

@Delete(':id/hard')
@Roles(Role.ADMIN)
@ApiOperation({ summary: 'Hard Delete: Remover agendamento definitivamente' })
removeHard(@Param('id', ParseIntPipe) id: number) {
  return this.appointmentsService.removeHard(id);
}
}
