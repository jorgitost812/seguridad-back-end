import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { SETTINGS } from '../../app.utils';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TrazasService } from '../../trazas/trazas.service';

@Controller('api/usuarios')
@ApiBearerAuth()
@ApiTags('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(
    private usuarioService: UsuariosService,
    private trazasService: TrazasService,
  ) {}

  @Get()
  getAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.usuarioService.findOne(id);
  }

  @Post()
  async create(
    @Body(SETTINGS.VALIDATION_PIPE) createUsuarioDto: CreateUsuarioDto,
    @Req() req,
  ) {
    return this.usuarioService.create(
      createUsuarioDto,
      req.user,
      this.trazasService,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Req() req,
  ) {
    return this.usuarioService.update(
      id,
      updateUsuarioDto,
      req.user,
      this.trazasService,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req) {
    return this.usuarioService.delete(id, req.user, this.trazasService);
  }

  @Get('by_joven_club/:id_joven_club')
  async getUsuariosByJovenClub(
    @Param('id_joven_club') idJovenClub: string,
  ): Promise<Usuario[]> {
    const jcId = parseInt(idJovenClub);
    if (isNaN(jcId)) throw new BadRequestException('ID de Joven Club inválido');
    return await this.usuarioService.findByIdJovenClub(jcId);
  }
}
