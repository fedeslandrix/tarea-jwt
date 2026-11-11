import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SociosModule } from "@/socios/socios.module";

@Module({
    imports: [
        SociosModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {
                    issuer: config.get<string>('JWT_ISSUER', 'mi-app'),
                    expiresIn: (config.get<string>('JWT_EXPIRES_IN', '1h') as any),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule{}