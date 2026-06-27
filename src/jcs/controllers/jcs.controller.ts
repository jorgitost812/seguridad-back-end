import { Controller, Get, Param, Post, Body, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { JovenclubService} from '../services/jcs.service';
import { Jclub } from '../entities/jc.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/jcs')
export class JovenclubController {

    constructor(
       private readonly jovenclubService: JovenclubService) {}
    
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.jovenclubService.findAll();
    }
    @UseGuards(JwtAuthGuard)
    @Get('by_municipio/:id_municipio')
    async getJovenesClubesByMunicipio(@Param('id_municipio') idMunicipio): Promise<Jclub[]> {
        console.log('Requesting JCs for municipio:', idMunicipio);
        const result = await this.jovenclubService.findByIdMunicipio(idMunicipio);
        console.log('Found JCs:', result);
        return result;
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body: any){
        return this.jovenclubService.create(body); 
        
    }
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    update(@Param('id') id: number, @Body() body: any){
        return this.jovenclubService.update(id, body);
        
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: number){
        return this.jovenclubService.delete(id);
       
    }


    @UseGuards(JwtAuthGuard)
    @Get('by_nombre_municipio/:nombre_municipio')
    async getJovenesClubesByNombreMunicipio(@Param('nombre_municipio') municipio):Promise<Jclub[]>{
        return await this.jovenclubService.findByNombreMunicipio(municipio);
    }
}
