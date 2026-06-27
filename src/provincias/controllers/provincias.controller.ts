import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, HttpException, HttpStatus} from '@nestjs/common';
import { ProvinciasService} from '../services/provincias.service';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProvinciaDto } from '../dto/create-provincia.dto';
import { UpdateProvinciaDto } from '../dto/update-provincia.dto';

@Controller('api/provincias')
@ApiBearerAuth()
@ApiTags('provincias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvinciasController {
    constructor(
        private provinciasService: ProvinciasService 
     ) {}
     @Get()
  async findAll() {
    try {
      const provincias = await this.provinciasService.findAll();
      return provincias;
    } catch (error) {
      throw new HttpException('Error fetching provincias', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

     @Get('by_provincia/:id')
  async findByProvincia(@Param('id') id: number) {
    return await this.provinciasService.findOne(id);
  }
     @Post()
     @Roles('Administrador')
     async create(@Body() createProvinciaDto: CreateProvinciaDto){
         return await this.provinciasService.create(createProvinciaDto); 
     }
     @Put(':id')
     @Roles('Administrador')
     update(@Param('id') id: number, @Body() updateProvinciaDto: UpdateProvinciaDto){
         return this.provinciasService.update(id, updateProvinciaDto);
     }
     @Delete(':id')
     @Roles('Administrador')
     delete(@Param('id') id: number){
         return this.provinciasService.delete(id);
     }
}
