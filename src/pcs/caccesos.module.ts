import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cAccesosService } from './services/caccesos.service';
import { cAccesosController } from './controllers/caccesos.controller';
import { cAccesos } from './entities/caccesos.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([cAccesos])
  ],
  providers: [cAccesosService],
  controllers: [cAccesosController]
})
export class cAccesosModule {}
