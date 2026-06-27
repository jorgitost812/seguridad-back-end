import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { RolesService} from '../services/roles.service';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller('api/roles')
export class RolesController {

    constructor(
       private rolesService: RolesService 
    ) {}
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.rolesService.findAll();
        //return [1,2,3,4];
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: number){
        return this.rolesService.findOne(id);
        //return id;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: any){
        return this.rolesService.create(body); 
        // return body;
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() body: any){
        return this.rolesService.update(id, body);
        // return body;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.rolesService.delete(id);
        //return true;
    }
}
