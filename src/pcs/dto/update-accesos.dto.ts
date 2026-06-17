import { IsOptional, IsString, IsBoolean, IsNumber, MinLength } from 'class-validator';

export class UpdateAccesoDto {
  @IsOptional()
  @IsString({ message: 'El nombre del Joven Club debe ser texto' })
  @MinLength(2, { message: 'El nombre del Joven Club debe tener mínimo 2 caracteres' })
  nombrejc?: string;

  @IsOptional()
  @IsString({ message: 'El nombre de la PC debe ser texto' })
  @MinLength(2, { message: 'El nombre de la PC debe tener mínimo 2 caracteres' })
  nombrepc?: string;

  @IsOptional()
  @IsString({ message: 'El técnico debe ser texto' })
  @MinLength(2, { message: 'El técnico debe tener mínimo 2 caracteres' })
  tecnico?: string;

  @IsOptional()
  @IsString({ message: 'El supervisor debe ser texto' })
  @MinLength(2, { message: 'El supervisor debe tener mínimo 2 caracteres' })
  supervisor?: string;

  @IsOptional()
  @IsString({ message: 'La causa debe ser texto' })
  @MinLength(3, { message: 'La causa debe tener mínimo 3 caracteres' })
  causa?: string;

  @IsOptional()
  @IsString({ message: 'El inventario debe ser texto' })
  @MinLength(2, { message: 'El inventario debe tener mínimo 2 caracteres' })
  inventario?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El ID de computadora debe ser un número válido' })
  computadora_id?: number;

  @IsOptional()
  @IsBoolean({ message: 'admin debe ser true o false' })
  admin?: boolean;
}
