import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PcService } from './services/pcs.service';
import { PcController } from './controllers/pcs.controller';
import { Computadora } from './entities/pc.entity';
import { TrazasModule } from '../trazas/trazas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Computadora]),
    TrazasModule  // ← IMPORTANTE: Agregar TrazasModule
  ],
  providers: [PcService],
  controllers: [PcController]
})
export class PcModule {}