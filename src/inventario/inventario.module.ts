import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { TrazasModule } from '../trazas/trazas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventario]), TrazasModule],
  providers: [InventarioService],
  controllers: [InventarioController],
  exports: [InventarioService],
})
export class InventarioModule {}
