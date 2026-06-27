import { BadRequestException, Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ReportesService } from '../services/accesos.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';


@Controller('api/reportes')
@UseGuards(JwtAuthGuard)
export class ReportesController {
  constructor(private reportesService: ReportesService) {}

  @Get('pc/:id_joven_club')
  async getReportePC(
    @Param('id_joven_club', ParseIntPipe) idJovenClub: number
  ) {
    return this.reportesService.getReportePC(idJovenClub);
  }

  @Get('pc-by-name/:nombrejc')
  async getAccesosByJC(@Param('nombrejc') nombrejc: string) {
    return this.reportesService.findByJC(nombrejc);
  }
}
