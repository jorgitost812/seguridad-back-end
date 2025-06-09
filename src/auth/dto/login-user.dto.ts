import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ example: 'Yoendris' })
    @IsNotEmpty()
    usuario: string;

    @ApiProperty({ example: 'admin123' })
    @IsNotEmpty()
    @Length(6, 24)
    password: string;
}