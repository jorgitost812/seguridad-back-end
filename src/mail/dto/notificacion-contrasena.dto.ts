import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NotificacionContrasenaDto {
    @IsNotEmpty({ message: 'El responsable es requerido' })
    @IsString({ message: 'El responsable debe ser texto' })
    @MinLength(2, { message: 'El responsable debe tener mínimo 2 caracteres' })
    responsable: string;

    @IsNotEmpty({ message: 'La computadora es requerida' })
    @IsString({ message: 'La computadora debe ser texto' })
    @MinLength(2, { message: 'La computadora debe tener mínimo 2 caracteres' })
    computadora: string;
}
