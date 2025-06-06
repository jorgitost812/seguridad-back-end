import { Controller, Get, Post, Body, Put, Param, Delete, ValidationPipe, UseGuards } from '@nestjs/common';
import { UsuariosService } from './../services/usuarios.service';
import { Usuario } from './../entities/usuario.entity';
import { CreateUsuarioDto } from './../dto/create-usuario.dto';
import { UpdateUsuarioDto } from './../dto/update-usuario.dto';
import { SETTINGS } from '../../app.utils';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
//import {REQUEST} from '@nestjs/core'

@Controller('api/usuarios')
@ApiBearerAuth()
@ApiTags('usuarios')
export class UsuariosController {
    constructor(private usuarioService: UsuariosService) {}
    @Get()
    @UseGuards(JwtAuthGuard)
    getAll(){
        return this.usuarioService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: number){
        return this.usuarioService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body(SETTINGS.VALIDATION_PIPE) createUsuarioDto: CreateUsuarioDto){
        return this.usuarioService.create(createUsuarioDto); 
    }
   // @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() updateUsuarioDto: UpdateUsuarioDto){
        return this.usuarioService.update(id, updateUsuarioDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.usuarioService.delete(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('by_joven_club/:id_joven_club')
    async getUsuariosByJovenClub(@Param('id_joven_club') idJovenClub):Promise<Usuario[]>{
        return await this.usuarioService.findByIdJovenClub(idJovenClub);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('by_rol/:id_rol')
    async getUsuariosByRol(@Param('id_rol') idRol):Promise<Usuario[]>{
        return await this.usuarioService.findByIdRol(idRol);
    }
   
    @UseGuards(JwtAuthGuard)
    @Get('by_nombre_rol/:nombre_rol')
    async getUsuariosByNombreRol(@Param('nombre_rol') nombreRol):Promise<Usuario[]>{
        return await this.usuarioService.findByNombreRol(nombreRol);
    }

    @UseGuards(JwtAuthGuard)
    @Get('by_joven_club_and_rol/:id_joven_club')
    async getUsuariosByIdJovenClubAndNombreRol(@Param('id_joven_club') idJovenClub):Promise<Usuario[]>{
        return await this.usuarioService.findByIdJovenClubAndNombreRol(idJovenClub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('by_municipio_and_rol/:id_joven_club')
    async getUsuariosByIdMunicipioAndNombreRol(@Param('id_joven_club') idJovenClub):Promise<Usuario[]>{
        return await this.usuarioService.findByIdMunicipioAndNombreRol(idJovenClub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('generate/password/:length')
    async generatePassword(@Param('length') length): Promise<string>{
        return await this.usuarioService.generatePassword(length);
    }
}
