import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { MunicipiosService } from '../services/municipios.service';
import {Municipio} from './../entities/municipio.entity';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller('api/municipios')
export class MunicipiosController {

    constructor(
       private municipiosService: MunicipiosService 
    ) {}
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.municipiosService.findAll();
        //return [1,2,3,4];
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: number){
        return this.municipiosService.findOne(id);
        //return id;
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: any){
        return this.municipiosService.create(body); 
       
    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() body: any){
        return this.municipiosService.update(id, body);
      
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.municipiosService.delete(id);
        
    }
    @UseGuards(JwtAuthGuard)
    @Get('by_provincia/:id_provincia')
    async getMunicipiosByProvincia(@Param('id_provincia') idProvincia):Promise<Municipio[]>{
        return await this.municipiosService.findByIdProvincia(idProvincia);
    }
}
