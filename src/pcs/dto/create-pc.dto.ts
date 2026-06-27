import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePcDto {
  @ApiProperty({ example: 'PC-01' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: '001' })
  @IsNotEmpty({ message: 'El número es requerido' })
  @IsString()
  numero: string;

  @ApiProperty({ example: '192.168.1.100' })
  @IsNotEmpty({ message: 'La IP es requerida' })
  @IsString()
  ip: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  pwd?: object;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  setupPwd?: object;
}
