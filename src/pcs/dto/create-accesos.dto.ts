import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateAccesoDto {
  @IsString()
  nombrejc: string;

  @IsString()
  nombrepc: string;

  @IsString()
  tecnico: string;

  @IsString()
  supervisor: string;

  @IsString()
  causa: string;

  @IsString()
  inventario: string;

  @IsNumber()
  computadora_id: number;

  @IsBoolean()
  @IsOptional()
  admin?: boolean;
}