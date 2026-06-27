import { PartialType } from '@nestjs/swagger';
import { CreatePcDto } from './create-pc.dto';

export class UpdatePcDto extends PartialType(CreatePcDto) {}
