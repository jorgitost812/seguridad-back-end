import { Rol } from 'src/roles/entities/role.entity';
import { Jclub } from 'src/jcs/entities/jc.entity';

export interface AuthenticatedUser {
  id: number;
  email: string;
  nombre: string;
  apellidos: string;
  rol?: Rol;
  jc?: Jclub;
  jcId?: number;
  activo: boolean;
  grupo_municipal: boolean;
}
