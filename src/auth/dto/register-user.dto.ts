import { IsString } from "class-validator";

export class RegisterUserDTO{
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    role: string;
}