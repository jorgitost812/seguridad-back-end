import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { Rol } from './entities/role.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([Rol])
  ],
  providers: [RolesService],
  controllers: [RolesController]
})
export class RolesModule {}
