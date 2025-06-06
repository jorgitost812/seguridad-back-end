import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { funcionesRolesService} from '../services/funcionesroles.service';

@Controller('api/funcionesroles')
export class funcionesRolesController {

    constructor(
       private funcionesrolesService: funcionesRolesService 
    ) {}
    @Get()
    getAll(){
        return this.funcionesrolesService.findAll();
        //return [1,2,3,4];
    }
    @Get(':id')
    getOne(@Param('id') id: number){
        return this.funcionesrolesService.findOne(id);
        //return id;
    }
    @Post()
    create(@Body() body: any){
        return this.funcionesrolesService.create(body); 
        // return body;
    }
    @Put(':id')
    update(@Param('id') id: number, @Body() body: any){
        return this.funcionesrolesService.update(id, body);
        // return body;
    }
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.funcionesrolesService.delete(id);
        //return true;
    }
}
