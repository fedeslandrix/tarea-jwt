import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SociosModule } from "@/socios/socios.module";
import { AuthGuard } from "./guards/auth.guard";

@Module({
    imports: [
        SociosModule,
        JwtModule.registerAsync({
            global: true,
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
    providers: [AuthService, AuthGuard],
    exports: [AuthGuard]
})
export class AuthModule{}