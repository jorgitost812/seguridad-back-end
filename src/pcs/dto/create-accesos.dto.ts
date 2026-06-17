import { IsString, IsBoolean, IsNumber, IsOptional, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAccesoDto {
  @IsNotEmpty({ message: 'El nombre del Joven Club es requerido' })
  @IsString({ message: 'El nombre del Joven Club debe ser texto' })
  @MinLength(2, { message: 'El nombre del Joven Club debe tener mínimo 2 caracteres' })
  nombrejc: string;

  @IsNotEmpty({ message: 'El nombre de la PC es requerido' })
  @IsString({ message: 'El nombre de la PC debe ser texto' })
  @MinLength(2, { message: 'El nombre de la PC debe tener mínimo 2 caracteres' })
  nombrepc: string;

  @IsNotEmpty({ message: 'El técnico es requerido' })
  @IsString({ message: 'El técnico debe ser texto' })
  @MinLength(2, { message: 'El técnico debe tener mínimo 2 caracteres' })
  tecnico: string;

  @IsNotEmpty({ message: 'El supervisor es requerido' })
  @IsString({ message: 'El supervisor debe ser texto' })
  @MinLength(2, { message: 'El supervisor debe tener mínimo 2 caracteres' })
  supervisor: string;

  @IsNotEmpty({ message: 'La causa es requerida' })
  @IsString({ message: 'La causa debe ser texto' })
  @MinLength(3, { message: 'La causa debe tener mínimo 3 caracteres' })
  causa: string;

  @IsNotEmpty({ message: 'El inventario es requerido' })
  @IsString({ message: 'El inventario debe ser texto' })
  @MinLength(2, { message: 'El inventario debe tener mínimo 2 caracteres' })
  inventario: string;

  @IsNotEmpty({ message: 'El ID de computadora es requerido' })
  @IsNumber({}, { message: 'El ID de computadora debe ser un número válido' })
  computadora_id: number;

  @IsOptional()
  @IsBoolean({ message: 'admin debe ser true o false' })
  admin?: boolean;
}
