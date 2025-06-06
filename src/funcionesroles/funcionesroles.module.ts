import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { funcionesRolesService } from './services/funcionesroles.service';
import { funcionesRolesController } from './controllers/funcionesroles.controller';
import { funcionesRol } from './entities/funcionesrole.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([funcionesRol])
  ],
  providers: [funcionesRolesService],
  controllers: [funcionesRolesController]
})
export class funcionesRolesModule {}
