import { Module } from '@nestjs/common';
import { LibrosModule } from './libros/libros.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { SaludController } from './salud/salud.controller';
import { SociosModule } from './socios/socios.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    LibrosModule, 
    SociosModule, 
    PrestamosModule, 
    AuthModule],
  controllers: [SaludController],
})
export class AppModule {}
