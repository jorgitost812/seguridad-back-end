import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { JovenclubService } from '../services/jcs.service';
import { Jclub } from '../entities/jc.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('api/jcs')
export class JovenclubController {
  private readonly logger = new Logger(JovenclubController.name);

  constructor(private readonly jovenclubService: JovenclubService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.jovenclubService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get('by_municipio/:id_municipio')
  async getJovenesClubesByMunicipio(
    @Param('id_municipio') idMunicipio: string,
  ): Promise<Jclub[]> {
    return this.jovenclubService.findByIdMunicipio(idMunicipio);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.jovenclubService.create(body);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.jovenclubService.update(id, body);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.jovenclubService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by_nombre_municipio/:nombre_municipio')
  async getJovenesClubesByNombreMunicipio(
    @Param('nombre_municipio') municipio: string,
  ): Promise<Jclub[]> {
    return this.jovenclubService.findByNombreMunicipio(municipio);
  }
}
