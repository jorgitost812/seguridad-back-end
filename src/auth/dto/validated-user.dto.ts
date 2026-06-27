import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Rol } from '../../roles/entities/role.entity';
import { Jclub } from '../../jcs/entities/jc.entity';
import { Exclude, Expose } from 'class-transformer';

export class ValidatedUserDto {
  @Expose()
  id: number;

  @Expose()
  nombre: string;

  @Expose()
  apellidos: string;

  @Expose()
  email: string;

  @Expose()
  rol: Rol;

  @Expose()
  jc: Jclub;

  @Expose()
  grupo_municipal: boolean;

  @Expose()
  activo: boolean;

  @Exclude()
  password?: string;

  static fromUsuario(usuario: Usuario): ValidatedUserDto {
    const dto = new ValidatedUserDto();
    dto.id = usuario.id;
    dto.nombre = usuario.nombre;
    dto.apellidos = usuario.apellidos;
    dto.email = usuario.email;
    dto.rol = usuario.rol;
    dto.jc = usuario.jc;
    dto.grupo_municipal = usuario.grupo_municipal;
    dto.activo = usuario.activo;
    return dto;
  }
}
