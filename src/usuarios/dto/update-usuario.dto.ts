import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @IsNumber()
  rolId?: number;

  @IsOptional()
  @IsNumber()
  jcId?: number;

  @IsOptional()
  @IsBoolean()
  grupo_municipal?: boolean;
}
