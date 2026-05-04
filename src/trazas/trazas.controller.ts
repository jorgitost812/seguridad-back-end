import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TrazasService } from './trazas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/trazas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrazasController {
  constructor(private readonly trazasService: TrazasService) {}

  @Get()
  @Roles('Administrador', 'AdministradorProv')
  async getAll(
    @Query('jcId') jcId?: string,
    @Query('limit') limit?: string,
    @Query('entidad') entidad?: string,
    @Query('accion') accion?: string,
  ) {
    return this.trazasService.findAll({
      jcId: jcId ? parseInt(jcId) : undefined,
      limit: limit ? parseInt(limit) : 20,
      entidad,
      accion,
    });
  }

  @Get('by-jc')
  @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
  async getByJc(@Query('jcId') jcId: string, @Query('limit') limit?: string) {
    return this.trazasService.findByJcId(
      parseInt(jcId),
      limit ? parseInt(limit) : 20,
    );
  }
}