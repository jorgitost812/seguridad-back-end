import { PartialType } from '@nestjs/mapped-types';
import { CreateAccesosDto } from './create-accesos.dto';

export class UpdateAccesosDto extends PartialType(CreateAccesosDto) {}
