import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Traza } from './entities/traza.entity';
import { TrazasService } from './trazas.service';
import { TrazasController } from './trazas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Traza])],
  providers: [TrazasService],
  controllers: [TrazasController],
  exports: [TrazasService], // ← Exportar para que otros módulos lo usen
})
export class TrazasModule {}
