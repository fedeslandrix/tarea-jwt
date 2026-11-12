import { SociosService } from "@/socios/socios.service";
import { 
    CanActivate, 
    Injectable,
    ExecutionContext,
    UnauthorizedException 
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Request } from "express";
import { RequestWithUser } from "../interfaces/request-with-user.interface";


@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: SociosService,
        private readonly reflector: Reflector
    ){}

    async canActivate(context: ExecutionContext){

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,
            [context.getClass(), context.getHandler()]
        )

        if (isPublic){
            return true
        }

        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const token = this.extractTokenFromHeader(request)

        if (!token) throw new UnauthorizedException('Usuario no autenticado')

        try{

            const payload = await this.jwtService.verifyAsync(token)

            const user = payload.email ? await this.userService.findByEmail(payload.email) : null

            if (!user) throw new UnauthorizedException('Usuario inexistente')

            const {pass_hash, ...safeUser} = user

            request.user = safeUser
  
        }
        catch {
            throw new UnauthorizedException('Token inválido o expirado')
        }

        return true;
    }

    private extractTokenFromHeader(request: Request){
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}