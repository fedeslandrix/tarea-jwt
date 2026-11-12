import { SociosService } from "@/socios/socios.service";
import { 
    CanActivate, 
    Injectable,
    ExecutionContext,
    UnauthorizedException, 
    ForbiddenException
} from "@nestjs/common";
import { RequestWithUser } from "../interfaces/request-with-user.interface";

@Injectable()
export class BibliotecarioGuard implements CanActivate{


    async canActivate(context: ExecutionContext){
        
        const request = context.switchToHttp().getRequest<RequestWithUser>()

        if (request.user?.role != 'bibliotecario')
            throw new ForbiddenException('Rol no autorizado')

        return true
    }

}