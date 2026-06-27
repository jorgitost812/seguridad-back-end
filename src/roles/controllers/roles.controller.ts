import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { RolesService} from '../services/roles.service';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRolDto } from '../dto/create-rol.dto';
import { UpdateRolDto } from '../dto/update-rol.dto';

@Controller('api/roles')
@ApiBearerAuth()
@ApiTags('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {

    constructor(
       private rolesService: RolesService 
    ) {}
    @Get()
    @Roles('Administrador')
    getAll(){
        return this.rolesService.findAll();
    }

    @Get(':id')
    @Roles('Administrador')
    getOne(@Param('id') id: number){
        return this.rolesService.findOne(id);
    }

    @Post()
    @Roles('Administrador')
    create(@Body() createRolDto: CreateRolDto){
        return this.rolesService.create(createRolDto); 
    }

    @Put(':id')
    @Roles('Administrador')
    update(@Param('id') id: number, @Body() updateRolDto: UpdateRolDto){
        return this.rolesService.update(id, updateRolDto);
    }

    @Delete(':id')
    @Roles('Administrador')
    delete(@Param('id') id: number){
        return this.rolesService.delete(id);
    }
}
