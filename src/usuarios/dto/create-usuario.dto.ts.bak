import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { MESSAGES, REGEX } from '../../app.utils'
export class CreateUsuarioDto {
    @IsNotEmpty()
    nombre: string;

    @IsNotEmpty()
	@Length(3, 30)
    apellidos: string;

    // @IsNotEmpty()
    // rol: number;

    // @IsNotEmpty()
    // jc: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    password: string;

    @IsNotEmpty()
    @Length(8, 24)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    confirmPassword: string;
}
