import { IsNotEmpty, IsEmail, IsString, Length, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { IsStrongPassword } from '../../common/validators/is-strong-password.validator';
import { Match } from '../../common/validators/match.validator';
import { IsNotEqualTo } from '../../common/validators/is-not-equal-to.validator';

export class CreateAuthDto {
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @IsString({ message: 'El nombre debe ser texto' })
    @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
    nombre: string;

    @IsNotEmpty({ message: 'Los apellidos son requeridos' })
    @IsString({ message: 'Los apellidos deben ser texto' })
    @Length(3, 150, { message: 'Los apellidos deben tener entre 3 y 150 caracteres' })
    apellidos: string;

    @IsNotEmpty({ message: 'El correo electrónico es requerido' })
    @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
    email: string;

    @IsNotEmpty({ message: 'El rol es requerido' })
    @IsNumber({}, { message: 'El rol debe ser un número válido' })
    rolId: number;

    @IsNotEmpty({ message: 'El Joven Club es requerido' })
    @IsNumber({}, { message: 'El Joven Club debe ser un número válido' })
    jcId: number;

    @IsOptional()
    @IsBoolean({ message: 'grupo_municipal debe ser true o false' })
    grupo_municipal?: boolean;

    @IsOptional()
    @IsBoolean({ message: 'activo debe ser true o false' })
    activo?: boolean;

    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @IsStrongPassword({ message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial' })
    @IsNotEqualTo('email', { message: 'La contraseña no puede ser igual al correo electrónico' })
    password: string;

    @IsNotEmpty({ message: 'La confirmación de contraseña es requerida' })
    @IsString({ message: 'La confirmación debe ser texto' })
    @Match('password', { message: 'La confirmación de contraseña no coincide con la contraseña' })
    confirmPassword: string;
}
