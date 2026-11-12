import { SocioSafe } from "@/socios/entities/socio.entity"
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: keyof SocioSafe, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        
        return data ? request.user?.data : request.user
    }  
)