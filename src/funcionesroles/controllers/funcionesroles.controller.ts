import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { funcionesRolesService} from '../services/funcionesroles.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateFuncionesRolDto } from '../dto/create-funcionesrol.dto';
import { UpdateFuncionesRolDto } from '../dto/update-funcionesrol.dto';

@Controller('api/funcionesroles')
@ApiBearerAuth()
@ApiTags('funcionesroles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class funcionesRolesController {

    constructor(
       private funcionesrolesService: funcionesRolesService 
    ) {}
    @Get()
    @Roles('Administrador')
    getAll(){
        return this.funcionesrolesService.findAll();
    }
    @Get(':id')
    @Roles('Administrador')
    getOne(@Param('id') id: number){
        return this.funcionesrolesService.findOne(id);
    }
    @Post()
    @Roles('Administrador')
    create(@Body() createDto: CreateFuncionesRolDto){
        return this.funcionesrolesService.create(createDto); 
    }
    @Put(':id')
    @Roles('Administrador')
    update(@Param('id') id: number, @Body() updateDto: UpdateFuncionesRolDto){
        return this.funcionesrolesService.update(id, updateDto);
    }
    @Delete(':id')
    @Roles('Administrador')
    delete(@Param('id') id: number){
        return this.funcionesrolesService.delete(id);
    }
}
