import { PartialType } from '@nestjs/mapped-types';
import { CreateAccesoDto } from './create-accesos.dto';


export class UpdateAccesoDto extends PartialType(CreateAccesoDto) {}