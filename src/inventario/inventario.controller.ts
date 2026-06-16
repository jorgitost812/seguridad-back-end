import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JcGuard } from '../auth/jc.guard';

@Controller('api/inventario')
@UseGuards(JwtAuthGuard, JcGuard)
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get()
  async getAll(@Req() req: any) {
    return this.inventarioService.findByJovenClub(req.jcId);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateInventarioDto, @Req() req: any) {
    if (!dto.jcId) dto.jcId = req.jcId;
    const user = { email: req.user.email, rol: req.user.rol };
    return this.inventarioService.create(dto, user);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventarioDto,
    @Req() req: any,
  ) {
    const user = { email: req.user.email, rol: req.user.rol };
    return this.inventarioService.update(id, dto, user);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const user = { email: req.user.email, rol: req.user.rol };
    await this.inventarioService.delete(id, user);
    return { message: 'Item eliminado correctamente' };
  }
}
