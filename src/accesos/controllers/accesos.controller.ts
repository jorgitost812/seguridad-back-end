import { BadRequestException, Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReportesService } from '../services/accesos.service';


@Controller('api/reportes')
export class ReportesController {
  constructor(private reportesService: ReportesService) {}

  @Get('pc/:id_joven_club')
  async getReportePC(
    @Param('id_joven_club', ParseIntPipe) idJovenClub: number
  ) {
    return this.reportesService.getReportePC(idJovenClub);
  }

  @Get('pc/:nombrejc')
  async getAccesosByJC(@Param('nombrejc') nombrejc: string) {
    return this.reportesService.findByJC(nombrejc);
  }
}
