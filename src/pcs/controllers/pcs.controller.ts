import { Controller, Get, Param, Post, Body, Put, Delete, ParseIntPipe, BadRequestException, Req } from '@nestjs/common';
import { PcService} from '../services/pcs.service';
import { Computadora } from '../entities/pc.entity';
import { TrazasService } from '../../trazas/trazas.service';

@Controller('api/pcs')
export class PcController {

    constructor(
       private pcService: PcService,
       private trazasService: TrazasService
    ) {}
    
    @Get()
    getAll(){
        return this.pcService.findAll();
    }
    
    @Get(':id')
    getOne(@Param('id') id: number){
        return this.pcService.findOne(id);
    }
    
    @Post()
    async create(@Body() body: any, @Req() req?: any){
        const user = { email: req?.user?.email || 'admin', rol: req?.user?.rol || 'Administrador' };
        return this.pcService.create(body, body.jcId || 1, user, this.trazasService);
    }
    
    @Put(':id')
    async update(@Param('id') id: number, @Body() body: any, @Req() req?: any){
        const user = { email: req?.user?.email || 'admin', rol: req?.user?.rol || 'Administrador' };
        return this.pcService.update(id, body, body.jcId, user, this.trazasService);
    }
    
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req?: any){
        const user = { email: req?.user?.email || 'admin', rol: req?.user?.rol || 'Administrador' };
        return this.pcService.delete(id, null, user, this.trazasService);
    }

    @Get('by_joven_club/:idJc')
    async getComputadorasByJovenClub(@Param('idJc', ParseIntPipe) idJc: number) {
        return this.pcService.findByJovenClub(idJc);
    }
}