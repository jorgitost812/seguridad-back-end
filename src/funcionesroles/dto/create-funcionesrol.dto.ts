import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFuncionesRolDto {
  @ApiProperty({ example: 'Gestionar usuarios' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;
}
