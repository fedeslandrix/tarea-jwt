import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SociosService } from "../socios/socios.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDTO } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';
import { ConfigService } from "@nestjs/config";
import { RegisterUserDTO } from "./dto/register-user.dto";
import { CrearSocioDto } from "@/socios/dto/crear-socio.dto";
import { Socio } from "@/socios/entities/socio.entity";

@Injectable()
export class AuthService{

    constructor(
        private readonly usersService: SociosService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}
    
    async register(registerDto: RegisterUserDTO){

        const user = this.usersService.findByEmail(registerDto.email)

        if (user) throw new ConflictException('Ya existe un socio registrado con ese mail')

        const hashed_pass = await bcrypt.hash(registerDto.password, 10)

        const newUserDto: CrearSocioDto = {
            nombre: registerDto.name,
            email: registerDto.email,
            pass_hash: hashed_pass,
            role: registerDto.role
        }

        const newUser = this.usersService.create(newUserDto)

        return this.generateToken(newUser);

    }

    private async generateToken(newUser: Socio){

        const payload = {
            sub: newUser.id,
            email: newUser.email,
            rol: newUser.role
        }

        const token = await this.jwtService.signAsync(payload);

        const {pass_hash, ...user} = newUser

        return {access_token: token, user: user}

    }

    async login(loginDto: LoginUserDTO){
        const userDb = this.usersService.findByEmail(loginDto.email);

        if(!userDb) throw new NotFoundException(`El socio no existe`);
        const esValida = await bcrypt.compare(loginDto.password, userDb.pass_hash)

        if (!esValida) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        
        const payload = {
            sub: userDb.id,
            email: userDb.email,
            rol: "socio"
        }
        
        const token = await this.jwtService.signAsync(payload);

        const {pass_hash, ...user} = userDb

        return {access_token: token, user: user}


    }
}