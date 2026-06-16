import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { TrazasService } from './trazas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JcGuard } from '../auth/jc.guard';

@Controller('api/trazas')
@UseGuards(JwtAuthGuard, JcGuard)
export class TrazasController {
  constructor(private readonly trazasService: TrazasService) {}

  @Get()
  async getAll(
    @Req() req: any,
    @Query('limit') limit?: string,
    @Query('entidad') entidad?: string,
    @Query('accion') accion?: string,
  ) {
    return this.trazasService.findAll({
      jcId: req.jcId,
      limit: limit ? parseInt(limit) : 50,
      entidad,
      accion,
    });
  }
}
