import { PartialType } from '@nestjs/swagger';
import { CreateFuncionesRolDto } from './create-funcionesrol.dto';

export class UpdateFuncionesRolDto extends PartialType(CreateFuncionesRolDto) {}
