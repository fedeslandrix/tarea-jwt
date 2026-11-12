import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CrearPrestamoDto } from './dto/crear-prestamo.dto';
import { PrestamosService } from './prestamos.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly service: PrestamosService) {}

  @Post()
  prestar(@Body() dto: CrearPrestamoDto) {
    return this.service.prestar(dto);
  }

  @Get()
  listar(@CurrentUser('id') userId: number) {
    return this.service.listar(userId);
  }

  @Get('vencidos')
  vencidos() {
    return this.service.listarVencidos();
  }

  @Get(':id')
  obtener(@CurrentUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.service.obtener(userId, id);
  }

  @Post(':id/devolucion')
  @HttpCode(200)
  devolver(@CurrentUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.service.devolver(userId, id);
  }
}
