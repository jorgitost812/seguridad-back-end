import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './controllers/accesos.controller';
import { ReportesService } from './services/accesos.service';
import { Acceso } from './entities/accesos.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Acceso])],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService]
})
export class ReportesModule {}