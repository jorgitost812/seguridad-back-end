import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { iniSesionService } from './services/inisesion.service';
import { iniSesionController } from './controllers/inisesion.controller';
import { iniSesion } from './entities/inisesion.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([iniSesion])
  ],
  providers: [iniSesionService],
  controllers: [iniSesionController],
  exports: [iniSesionService, TypeOrmModule]
})
export class iniSesionModule {}