import { Controller, Get, Param, Post, Body, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { JovenclubService} from '../services/jcs.service';
import { Jclub } from '../entities/jc.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateJcDto } from '../dto/create-jc.dto';
import { UpdateJcDto } from '../dto/update-jc.dto';

@Controller('api/jcs')
@ApiBearerAuth()
@ApiTags('jcs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JovenclubController {

    constructor(
       private readonly jovenclubService: JovenclubService) {}
    
    @Get()
    getAll(){
        return this.jovenclubService.findAll();
    }
    @Get('by_municipio/:id_municipio')
    async getJovenesClubesByMunicipio(@Param('id_municipio') idMunicipio): Promise<Jclub[]> {
        return await this.jovenclubService.findByIdMunicipio(idMunicipio);
    }
    @Post()
    @Roles('Administrador', 'AdministradorProv')
    create(@Body() createJcDto: CreateJcDto){
        return this.jovenclubService.create(createJcDto); 
    }
    @Put(':id')
    @Roles('Administrador', 'AdministradorProv')
    update(@Param('id') id: number, @Body() updateJcDto: UpdateJcDto){
        return this.jovenclubService.update(id, updateJcDto);
    }
    @Delete(':id')
    @Roles('Administrador')
    delete(@Param('id') id: number){
        return this.jovenclubService.delete(id);
    }

    @Get('by_nombre_municipio/:nombre_municipio')
    async getJovenesClubesByNombreMunicipio(@Param('nombre_municipio') municipio):Promise<Jclub[]>{
        return await this.jovenclubService.findByNombreMunicipio(municipio);
    }
}
