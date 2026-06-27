import { Controller, Get, Param, Post, Body, Put, Delete, ParseIntPipe, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { PcService} from '../services/pcs.service';
import { Computadora } from '../entities/pc.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { JcGuard } from '../../auth/jc.guard';
import { Roles } from '../../auth/roles.decorator';
import { TrazasService } from '../../trazas/trazas.service';

@Controller('api/pcs')
export class PcController {

    constructor(
       private pcService: PcService,
       private trazasService: TrazasService
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
    @Roles('AdministradorJC', 'Técnico', 'Supervisor')
    async create(@Body() body: any, @Req() req){
        console.log('=== PC CONTROLLER - CREATE ===');
        console.log('req.user:', req.user);
        
        body.jcId = req.user.jcId;
        
        // Extraer el email y rol correctamente
        const userEmail = req.user.email;
        const userRol = req.user.rol?.nombre || req.user.rol || 'Administrador';
        
        const userForTrace = {
            email: userEmail,
            rol: userRol,
            jcId: req.user.jcId
        };
        
        console.log('userForTrace:', userForTrace);
        
        return this.pcService.create(body, req.user.jcId, userForTrace, this.trazasService);
    }
    
    @Put(':id')
    @UseGuards(JwtAuthGuard, JcGuard, RolesGuard)
    @Roles('AdministradorJC', 'Técnico', 'Supervisor')
    async update(@Param('id') id: number, @Body() body: any, @Req() req){
        console.log('=== PC CONTROLLER - UPDATE ===');
        console.log('ID:', id);
        console.log('req.user:', req.user);
        
        let userRol = req.user.rol;
        if (userRol && typeof userRol === 'object' && userRol.nombre) {
            userRol = userRol.nombre;
        }
        
        const userForTrace = {
            email: req.user.email,
            rol: userRol,
            jcId: req.user.jcId
        };
        
        return this.pcService.update(id, body, req.user.jcId, userForTrace, this.trazasService);
    }
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard, JcGuard, RolesGuard)
    @Roles('AdministradorJC')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
        console.log('=== PC CONTROLLER - DELETE ===');
        console.log('ID:', id);
        console.log('req.user:', req.user);
        
        let userRol = req.user.rol;
        if (userRol && typeof userRol === 'object' && userRol.nombre) {
            userRol = userRol.nombre;
        }
        
        const userForTrace = {
            email: req.user.email,
            rol: userRol,
            jcId: req.user.jcId
        };
        
        return this.pcService.delete(id, req.user.jcId, userForTrace, this.trazasService);
    }

    @Get('by_joven_club/:idJc')
    @UseGuards(JwtAuthGuard)
    async getComputadorasByJovenClub(@Param('idJc', ParseIntPipe) idJc: number) {
        console.log('=== Obteniendo PCs por JC ===');
        if (isNaN(idJc) || idJc <= 0) {
            throw new BadRequestException('ID de Joven Club inválido');
        }
        return this.pcService.findByJovenClub(idJc);
    }

    @Get('by_nombre_joven_club/:nombre_joven_club')
    @UseGuards(JwtAuthGuard)
    async getComputadorasByNombreJovenClub(@Param('nombre_joven_club') nombre): Promise<Computadora[]>{
        console.log('=== Obteniendo PCs por nombre de JC ===');
        return await this.pcService.findByNombreJovenClub(nombre);
    }
}