import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateInventarioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El estado es requerido' })
  estado: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsNumber()
  @IsNotEmpty({ message: 'La ubicación es requerida' })
  jcId: number;
}