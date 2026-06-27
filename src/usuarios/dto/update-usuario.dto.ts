import { IsOptional, IsBoolean, IsNumber, IsString, IsEmail, Length } from 'class-validator';
import { IsStrongPassword } from '../../common/validators/is-strong-password.validator';
import { Match } from '../../common/validators/match.validator';
import { IsNotEqualTo } from '../../common/validators/is-not-equal-to.validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'Los apellidos deben ser texto' })
  @Length(3, 150, { message: 'Los apellidos deben tener entre 3 y 150 caracteres' })
  apellidos?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El rol debe ser un número válido' })
  rolId?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El Joven Club debe ser un número válido' })
  jcId?: number;

  @IsOptional()
  @IsBoolean({ message: 'grupo_municipal debe ser true o false' })
  grupo_municipal?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'activo debe ser true o false' })
  activo?: boolean;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  email?: string;

  @IsOptional()
  @IsStrongPassword({ message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial' })
  @IsNotEqualTo('email', { message: 'La contraseña no puede ser igual al correo electrónico' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'La confirmación debe ser texto' })
  @Match('password', { message: 'La confirmación de contraseña no coincide con la contraseña' })
  confirmPassword?: string;
}
