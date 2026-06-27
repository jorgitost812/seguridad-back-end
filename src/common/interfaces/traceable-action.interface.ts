import { Rol } from 'src/roles/entities/role.entity';
import { Jclub } from 'src/jcs/entities/jc.entity';

export interface TraceableAction {
  usuarioEmail: string;
  usuarioRol: string;
  accion: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  entidad: string;
  entidadId?: number;
  entidadNombre?: string;
  jcId?: number;
  detalles?: Record<string, any>;
}
