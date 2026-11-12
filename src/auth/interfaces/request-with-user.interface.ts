import { Request } from 'express';
import { Socio } from '@/socios/entities/socio.entity';

export interface RequestWithUser extends Request {
    user?: Omit<Socio, 'pass_hash'>;
}
