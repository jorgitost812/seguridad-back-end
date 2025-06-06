import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcService } from './services/pcs.service';
import { PcController } from './controllers/pcs.controller';
import { Computadora } from './entities/pc.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Computadora])
  ],
  providers: [PcService],
  controllers: [PcController]
})
export class PcModule {}
