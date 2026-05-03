import { Controller, Get, Param, Post, Body, Put, Delete, ParseIntPipe, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { PcService} from '../services/pcs.service';
import { Computadora } from '../entities/pc.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { JcGuard } from '../../auth/jc.guard';
import { Roles } from '../../auth/roles.decorator';


@Controller('api/pcs')
export class PcController {

    constructor(
       private pcService: PcService 
    ) {}
    
    @Get('mi_jc')
    @UseGuards(JwtAuthGuard, JcGuard)
    getComputadorasByMiJc(@Req() req){
        return this.pcService.findByJovenClub(req.user.jcId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getAll(){
        return this.pcService.findAll();
    }
    
    @Get(':id')
    @UseGuards(JwtAuthGuard, JcGuard)
    getOne(@Param('id') id: number, @Req() req){
        return this.pcService.findOne(id, req.user.jcId);
    }
    
    @Post()
    @UseGuards(JwtAuthGuard, JcGuard, RolesGuard)
    @Roles('AdministradorJC', 'Técnico')
    create(@Body() body: any, @Req() req){
        console.log('=== Creando PC ===');
        console.log('Usuario del request:', req.user);
        console.log('Body recibido:', body);
        console.log('Rol del usuario:', req.user?.rol);
        console.log('JC ID del usuario:', req.user?.jcId);
        body.jcId = req.user.jcId;
        console.log('Body final a enviar al servicio:', body);
        return this.pcService.create(body); 
    }
    
    @Put(':id')
    @UseGuards(JwtAuthGuard, JcGuard, RolesGuard)
    @Roles('AdministradorJC', 'Técnico')
    update(@Param('id') id: number, @Body() body: any, @Req() req){
        console.log('=== Actualizando PC ===');
        console.log('ID:', id);
        console.log('Body:', body);
        console.log('Usuario:', req.user);
        return this.pcService.update(id, body, req.user.jcId);
    }
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard, JcGuard, RolesGuard)
    @Roles('AdministradorJC')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
      console.log('=== Eliminando PC ===');
      console.log('ID:', id);
      console.log('Usuario:', req.user);
      try {
        const result = await this.pcService.delete(id, req.user.jcId);
        return {
          success: true,
          message: 'PC eliminada correctamente'
        };
      } catch (error) {
        throw new BadRequestException({
          success: false,
          message: error.message
        });
      }
    }

    @Get('by_joven_club/:idJc')
    @UseGuards(JwtAuthGuard)
    async getComputadorasByJovenClub(
      @Param('idJc', ParseIntPipe) idJc: number
    ) {
      console.log('=== Obteniendo PCs por JC ===');
      console.log('ID JC:', idJc);
      if (isNaN(idJc) || idJc <= 0) {
        throw new BadRequestException('ID de Joven Club inválido');
      }
      
      return this.pcService.findByJovenClub(idJc);
    }

    @Get('by_nombre_joven_club/:nombre_joven_club')
    @UseGuards(JwtAuthGuard)
    async getComputadorasByNombreJovenClub(@Param('nombre_joven_club') nombre):Promise<Computadora[]>{
        console.log('=== Obteniendo PCs por nombre de JC ===');
        console.log('Nombre JC:', nombre);
        return await this.pcService.findByNombreJovenClub(nombre);
    }

}