import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MunicipiosService } from '../services/municipios.service';
import {Municipio} from './../entities/municipio.entity';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMunicipioDto } from '../dto/create-municipio.dto';
import { UpdateMunicipioDto } from '../dto/update-municipio.dto';

@Controller('api/municipios')
@ApiBearerAuth()
@ApiTags('municipios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MunicipiosController {

    constructor(
       private municipiosService: MunicipiosService 
    ) {}
    @Get()
    getAll(){
        return this.municipiosService.findAll();
    }
    @Get('by_provincia/:id')
    async findByProvincia(@Param('id') provinciaId: number) {
        return this.municipiosService.findByProvincia(provinciaId);
    }
    @Post()
    @Roles('Administrador', 'AdministradorProv')
    create(@Body() createMunicipioDto: CreateMunicipioDto){
        return this.municipiosService.create(createMunicipioDto); 
    }
    @Put(':id')
    @Roles('Administrador', 'AdministradorProv')
    update(@Param('id') id: number, @Body() updateMunicipioDto: UpdateMunicipioDto){
        return this.municipiosService.update(id, updateMunicipioDto);
    }
    @Delete(':id')
    @Roles('Administrador')
    delete(@Param('id') id: number){
        return this.municipiosService.delete(id);
    }
}
