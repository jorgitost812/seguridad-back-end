import { PartialType } from '@nestjs/swagger';
import { CreateJcDto } from './create-jc.dto';

export class UpdateJcDto extends PartialType(CreateJcDto) {}
