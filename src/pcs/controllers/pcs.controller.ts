import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { PcService} from '../services/pcs.service';
import { Computadora } from '../entities/pc.entity';


@Controller('api/pcs')
export class PcController {

    constructor(
       private pcService: PcService 
    ) {}
	//Computadoras
    @Get()
    getAll(){
        return this.pcService.findAll();
        //return [1,2,3,4];
    }
    @Get(':id')
    getOne(@Param('id') id: number){
        return this.pcService.findOne(id);
        //return id;
    }
    @Post()
    create(@Body() body: any){
        return this.pcService.create(body); 
        // return body;
    }
    @Put(':id')
    update(@Param('id') id: number, @Body() body: any){
        return this.pcService.update(id, body);
        // return body;
    }
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.pcService.delete(id);
        //return true;
    }

    @Get('by_joven_club/:id_joven_club')
    async getComputadorasByJovenClub(@Param('id_joven_club') idJovenClub):Promise<Computadora[]>{
        return await this.pcService.findByIdJovenClub(idJovenClub);
    }

    @Get('by_nombre_joven_club/:nombre_joven_club')
    async getComputadorasByNombreJovenClub(@Param('nombre_joven_club') nombre):Promise<Computadora[]>{
        return await this.pcService.findByNombreJovenClub(nombre);
    }

}
