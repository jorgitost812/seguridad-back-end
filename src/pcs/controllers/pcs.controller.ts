import { Controller, Get, Param, Post, Body, Put, Delete, ParseIntPipe, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { PcService} from '../services/pcs.service';
import { Computadora } from '../entities/pc.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { JcGuard } from '../../auth/jc.guard';
import { Roles } from '../../auth/roles.decorator';
import { TrazasService } from '../../trazas/trazas.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePcDto } from '../dto/create-pc.dto';
import { UpdatePcDto } from '../dto/update-pc.dto';

@Controller('api/pcs')
@ApiBearerAuth()
@ApiTags('pcs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PcController {

    constructor(
       private pcService: PcService,
       private trazasService: TrazasService
    ) {}
    
    @Get('mi_jc')
    @UseGuards(JcGuard)
    getComputadorasByMiJc(@Req() req){
        return this.pcService.findByJovenClub(req.user.jcId);
    }

    @Get()
    getAll(){
        return this.pcService.findAll();
    }
    
    @Get(':id')
    @UseGuards(JcGuard)
    getOne(@Param('id') id: number, @Req() req){
        return this.pcService.findOne(id, req.user.jcId);
    }
    
    @Post()
    @UseGuards(JcGuard)
    @Roles('AdministradorJC', 'Técnico', 'Supervisor')
    async create(@Body() createPcDto: CreatePcDto, @Req() req){
        const userForTrace = {
            email: req.user.email,
            rol: req.user.rol?.nombre || req.user.rol || 'Administrador',
            jcId: req.user.jcId
        };
        
        return this.pcService.create(createPcDto, req.user.jcId, userForTrace, this.trazasService);
    }
    
    @Put(':id')
    @UseGuards(JcGuard)
    @Roles('AdministradorJC', 'Técnico', 'Supervisor')
    async update(@Param('id') id: number, @Body() updatePcDto: UpdatePcDto, @Req() req){
        let userRol = req.user.rol;
        if (userRol && typeof userRol === 'object' && userRol.nombre) {
            userRol = userRol.nombre;
        }
        
        const userForTrace = {
            email: req.user.email,
            rol: userRol,
            jcId: req.user.jcId
        };
        
        return this.pcService.update(id, updatePcDto, req.user.jcId, userForTrace, this.trazasService);
    }
    
    @Delete(':id')
    @UseGuards(JcGuard)
    @Roles('AdministradorJC')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
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
    async getComputadorasByJovenClub(@Param('idJc', ParseIntPipe) idJc: number) {
        if (isNaN(idJc) || idJc <= 0) {
            throw new BadRequestException('ID de Joven Club inválido');
        }
        return this.pcService.findByJovenClub(idJc);
    }

    @Get('by_nombre_joven_club/:nombre_joven_club')
    async getComputadorasByNombreJovenClub(@Param('nombre_joven_club') nombre): Promise<Computadora[]>{
        return await this.pcService.findByNombreJovenClub(nombre);
    }
}
