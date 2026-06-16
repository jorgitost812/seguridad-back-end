import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PcService } from '../services/pcs.service';
import { TrazasService } from '../../trazas/trazas.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { JcGuard } from '../../auth/jc.guard';

@Controller('api/pcs')
@UseGuards(JwtAuthGuard, JcGuard)
export class PcController {
  constructor(
    private pcService: PcService,
    private trazasService: TrazasService,
  ) {}

  @Get()
  getAll(@Req() req: any) {
    return this.pcService.findByJovenClub(req.jcId);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.pcService.findOne(id);
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const user = { email: req.user.email, rol: req.user.rol };
    return this.pcService.create(body, req.jcId, user, this.trazasService);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any, @Req() req: any) {
    const user = { email: req.user.email, rol: req.user.rol };
    return this.pcService.update(id, body, req.jcId, user, this.trazasService);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const user = { email: req.user.email, rol: req.user.rol };
    return this.pcService.delete(id, req.jcId, user, this.trazasService);
  }
}
