import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, HttpException, HttpStatus} from '@nestjs/common';
import { ProvinciasService} from '../services/provincias.service';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller('api/provincias')
export class ProvinciasController {
    constructor(
        private provinciasService: ProvinciasService 
     ) {}
     @UseGuards(JwtAuthGuard)
     @Get()
  async findAll() {
    try {
      const provincias = await this.provinciasService.findAll();
      return provincias;
    } catch (error) {
      throw new HttpException('Error fetching provincias', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

     @UseGuards(JwtAuthGuard)
     @Get('by_provincia/:id')
  async findByProvincia(@Param('id') id: number) {
    return await this.provinciasService.findOne(id);
  }
     @UseGuards(JwtAuthGuard)
     @Post()
     async create(@Body() body: any){
         return await this.provinciasService.create(body); 
         // return body;
     }
     @UseGuards(JwtAuthGuard)
     @Put(':id')
     update(@Param('id') id: number, @Body() body: any){
         return this.provinciasService.update(id, body);
         // return body;
     }
     @UseGuards(JwtAuthGuard)
     @Delete(':id')
     delete(@Param('id') id: number){
         return this.provinciasService.delete(id);
         //return true;
     }
}