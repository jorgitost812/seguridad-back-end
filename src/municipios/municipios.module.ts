import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipiosService } from './services/municipios.service';
import { MunicipiosController } from './controllers/municipios.controller';
import { Municipio } from './entities/municipio.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([Municipio])
  ],
  providers: [MunicipiosService],
  controllers: [MunicipiosController]
})
export class MunicipiosModule {}