import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProvinciaDto {
  @ApiProperty({ example: 'La Habana' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;
}
