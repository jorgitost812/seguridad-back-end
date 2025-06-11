import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
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
    @Get('by-provincia/:idProvincia')
async getMunicipiosByProvincia(
  @Param('idProvincia', ParseIntPipe) idProvincia: number // Asegura tipo número
) {
  return this.municipiosService.findByIdProvincia(idProvincia);
}
}
