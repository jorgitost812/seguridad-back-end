import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinciasService } from './services/provincias.service';
import { ProvinciasController } from './controllers/provincias.controller';
import { Provincia } from './entities/provincia.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([Provincia])
  ],
  providers: [ProvinciasService],
  controllers: [ProvinciasController]
})
export class ProvinciasModule {}