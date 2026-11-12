export class Socio {
  id: number;
  nombre: string;
  email: string;
  pass_hash: string;
  role: string
}

export type SocioSafe = Omit<Socio, 'pass_hash'>
