import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { MESSAGES, REGEX } from '../../app.utils'
export class CreateUsuarioDto {
    @IsNotEmpty()
    nombre: string;

    @IsNotEmpty()
	@Length(3, 30)
    apellidos: string;

    @IsNotEmpty({ message: 'El rol es requerido' })
    rolId: number;

    @IsNotEmpty({ message: 'El Joven Club es requerido' })
    jcId: number;

    grupo_municipal: boolean;
    
    activo: boolean;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
  @Length(8)
  @Matches(REGEX.PASSWORD_RULE, {
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
  })
  password: string;

    @IsNotEmpty()
    @Length(8, 24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    confirmPassword: string;
}
