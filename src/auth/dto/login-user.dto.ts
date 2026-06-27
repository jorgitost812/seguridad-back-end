import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ example: 'usuario@gmail.com', description: 'Correo electrónico del usuario' })
    @IsNotEmpty({ message: 'El correo electrónico es requerido' })
    @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
    email: string;

    @ApiProperty({ example: 'admin123', description: 'Contraseña del usuario' })
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @IsString({ message: 'La contraseña debe ser texto' })
    @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
    password: string;
}
