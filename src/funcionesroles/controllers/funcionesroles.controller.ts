import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { funcionesRolesService} from '../services/funcionesroles.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('api/funcionesroles')
export class funcionesRolesController {

    constructor(
       private funcionesrolesService: funcionesRolesService 
    ) {}
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.funcionesrolesService.findAll();
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: number){
        return this.funcionesrolesService.findOne(id);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: any){
        return this.funcionesrolesService.create(body); 
    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() body: any){
        return this.funcionesrolesService.update(id, body);
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.funcionesrolesService.delete(id);
    }
}
