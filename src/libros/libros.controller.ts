import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ActualizarLibroDto } from './dto/actualizar-libro.dto';
import { CrearLibroDto } from './dto/crear-libro.dto';
import { LibrosService } from './libros.service';
import { BibliotecarioGuard } from '@/auth/guards/bibliotecario.guard';

@Controller('libros')
export class LibrosController {
  constructor(private readonly service: LibrosService) {}


  @UseGuards(BibliotecarioGuard)
  @Post()
  create(@Body() dto: CrearLibroDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }


  @UseGuards(BibliotecarioGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarLibroDto,
  ) {
    return this.service.update(id, dto);
  }


  @UseGuards(BibliotecarioGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.service.remove(id);
  }
}
