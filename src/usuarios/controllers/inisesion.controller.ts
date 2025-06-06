import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { iniSesionService} from '../services/inisesion.service';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { iniSesion } from '../entities/inisesion.entity';

@Controller('api/inisesion')
export class iniSesionController {

    constructor(
       private inisesionService: iniSesionService 
    ) {}
	
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.inisesionService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: number){
        return this.inisesionService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: any){
        return this.inisesionService.create(body); 
    }
}
