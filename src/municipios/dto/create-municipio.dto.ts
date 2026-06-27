import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMunicipioDto {
  @ApiProperty({ example: 'San José de las Lajas' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'La provincia es requerida' })
  @IsNumber()
  provinciaId: number;
}
