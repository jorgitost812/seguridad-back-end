import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateInventarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El estado es requerido' })
  estado: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precio: number;

  @IsNumber()
  @IsOptional()
  jcId: number;
}
