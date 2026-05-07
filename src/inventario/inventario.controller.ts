import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Req } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Controller('api/inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get()
  async getAll() { return this.inventarioService.findAll(); }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) { return this.inventarioService.findOne(id); }

  @Get('jc/:jcId')
  async getByJovenClub(@Param('jcId', ParseIntPipe) jcId: number) { return this.inventarioService.findByJovenClub(jcId); }

  @Post()
  async create(@Body() dto: CreateInventarioDto, @Req() req?: any) {
    const user = { email: req?.user?.email || 'admin', rol: req?.user?.rol || 'Administrador' };
    return this.inventarioService.create(dto, user);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInventarioDto, @Req() req?: any) {
    const user = { email: req?.user?.email || 'admin', rol: req?.user?.rol || 'Administrador' };
    return this.inventarioService.update(id, dto, user);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req?: any) {
    const user = { email: req?.user?.email || 'admin', rol: req?.user?.rol || 'Administrador' };
    await this.inventarioService.delete(id, user);
    return { message: 'Item eliminado correctamente' };
  }
}