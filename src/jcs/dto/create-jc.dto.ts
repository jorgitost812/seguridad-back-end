import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJcDto {
  @ApiProperty({ example: 'JCe-1' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'El municipio es requerido' })
  @IsNumber()
  municipioId: number;
}
