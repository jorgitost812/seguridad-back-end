import { Controller, Get, Post, Body, Put, Param, Delete, ValidationPipe, UseGuards, BadRequestException, ParseIntPipe, Req } from '@nestjs/common';
import { UsuariosService } from './../services/usuarios.service';
import { Usuario } from './../entities/usuario.entity';
import { CreateUsuarioDto } from './../dto/create-usuario.dto';
import { UpdateUsuarioDto } from './../dto/update-usuario.dto';
import { SETTINGS } from '../../app.utils';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('api/usuarios')
@ApiBearerAuth()
@ApiTags('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
    constructor(private usuarioService: UsuariosService) {}
    
    @Get()
    @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
    getAll(){
        return this.usuarioService.findAll();
    }

    @Get(':id')
    @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
    getOne(@Param('id') id: number){
        return this.usuarioService.findOne(id);
    }

    @Post()
    @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
    create(@Body(SETTINGS.VALIDATION_PIPE) createUsuarioDto: CreateUsuarioDto, @Req() req){
        // Si es AdministradorJC, forzar su propio jcId
        const userRole = req.user.rol?.nombre || req.user.rol;
        if (userRole === 'AdministradorJC') {
            createUsuarioDto.jcId = req.user.jcId;
        }
        return this.usuarioService.create(createUsuarioDto); 
    }
    
    @Put(':id')
    @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
    update(@Param('id') id: number, @Body() updateUsuarioDto: UpdateUsuarioDto, @Req() req){
        const userRole = req.user.rol?.nombre || req.user.rol;
        if (userRole === 'AdministradorJC') {
            // Forzar que solo pueda asignar usuarios a su propio JC
            updateUsuarioDto.jcId = req.user.jcId;
        }
        return this.usuarioService.update(id, updateUsuarioDto);
    }

    @Delete(':id')
    @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
    delete(@Param('id') id: number, @Req() req){
        return this.usuarioService.delete(id);
    }

    @Get('by_joven_club/:id_joven_club')
    @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
    async getUsuariosByJovenClub(@Param('id_joven_club') idJovenClub: string, @Req() req): Promise<Usuario[]> {
        let jcId = parseInt(idJovenClub);
        const userRole = req.user.rol?.nombre || req.user.rol;
        
        // Si es AdministradorJC, solo puede ver su propio JC
        if (userRole === 'AdministradorJC') {
            jcId = req.user.jcId;
        }
        
        if (isNaN(jcId)) {
            throw new BadRequestException('ID de Joven Club inválido');
        }
        
        console.log('Fetching users for JC:', jcId);
        const users = await this.usuarioService.findByIdJovenClub(jcId);
        console.log('Found users:', users.length);
        return users;
    }
    
    @Get('by_rol/:id_rol')
    @Roles('Administrador', 'AdministradorProv')
    async getUsuariosByRol(@Param('id_rol') idRol: string): Promise<Usuario[]>{
        const rolId = parseInt(idRol);
        if (isNaN(rolId)) {
            throw new BadRequestException('ID de Rol inválido');
        }
        return await this.usuarioService.findByIdRol(rolId);
    }
   
    @Get('by_nombre_rol/:nombre_rol')
    @Roles('Administrador', 'AdministradorProv')
    async getUsuariosByNombreRol(@Param('nombre_rol') nombreRol: string): Promise<Usuario[]>{
        return await this.usuarioService.findByNombreRol(nombreRol);
    }

    @Get('by_joven_club_and_rol/:id_joven_club')
    @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
    async getUsuariosByIdJovenClubAndNombreRol(
      @Param('id_joven_club', ParseIntPipe) idJovenClub: number,
      @Req() req
    ): Promise<Usuario[]> {
      let jcId = idJovenClub;
      const userRole = req.user.rol?.nombre || req.user.rol;
      
      // Si es AdministradorJC, solo puede ver su propio JC
      if (userRole === 'AdministradorJC') {
        jcId = req.user.jcId;
      }
      
      try {
        return await this.usuarioService.findByIdJovenClubAndNombreRol(jcId);
      } catch (error) {
        throw new BadRequestException(`Error fetching users: ${error.message}`);
      }
    }

    @Get('generate/password/:length')
    @Roles('Administrador', 'AdministradorProv')
    async generatePassword(@Param('length') length: string): Promise<string>{
        const len = parseInt(length);
        if (isNaN(len)) {
            throw new BadRequestException('La longitud debe ser un número');
        }
        return await this.usuarioService.generatePassword(len);
    }
}