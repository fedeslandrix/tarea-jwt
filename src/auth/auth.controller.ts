import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';


@Controller('auth')
export class AuthController {

    constructor(private readonly service: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterUserDTO){
      return this.service.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginUserDTO){
      return this.service.login(dto);
    }
    

}