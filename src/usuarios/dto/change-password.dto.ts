import { IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from '../../common/validators/is-strong-password.validator';
import { Match } from '../../common/validators/match.validator';
import { IsNotEqualTo } from '../../common/validators/is-not-equal-to.validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  @IsString({ message: 'La contraseña actual debe ser texto' })
  currentPassword: string;

  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @IsStrongPassword({ message: 'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial' })
  @IsNotEqualTo('currentPassword', { message: 'La nueva contraseña no puede ser igual a la contraseña actual' })
  newPassword: string;

  @IsNotEmpty({ message: 'La confirmación de nueva contraseña es requerida' })
  @IsString({ message: 'La confirmación debe ser texto' })
  @Match('newPassword', { message: 'La confirmación de contraseña no coincide con la nueva contraseña' })
  confirmPassword: string;
}
