import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRolDto {
  @ApiProperty({ example: 'Administrador' })
  @IsNotEmpty({ message: 'El nombre del rol es requerido' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ example: 'Rol con acceso total' })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
