import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
  Req,
  Logger,
} from '@nestjs/common';
import { UsuariosService } from './../services/usuarios.service';
import { Usuario } from './../entities/usuario.entity';
import { CreateUsuarioDto } from './../dto/create-usuario.dto';
import { UpdateUsuarioDto } from './../dto/update-usuario.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TrazasService } from '../../trazas/trazas.service';

@Controller('api/usuarios')
@ApiBearerAuth()
@ApiTags('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  private readonly logger = new Logger(UsuariosController.name);

  constructor(
    private usuarioService: UsuariosService,
    private trazasService: TrazasService,
  ) {}

  @Get()
  @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
  getAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
  getOne(@Param('id') id: number) {
    return this.usuarioService.findOne(id);
  }

  @Post()
  @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
  async create(@Body() createUsuarioDto: CreateUsuarioDto, @Req() req) {
    const userRole = req.user.rol?.nombre || req.user.rol;
    if (userRole === 'AdministradorJC') {
      createUsuarioDto.jcId = req.user.jcId;
    }
    return this.usuarioService.create(
      createUsuarioDto,
      req.user,
      this.trazasService,
    );
  }

  @Put(':id')
  @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
  async update(
    @Param('id') id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Req() req,
  ) {
    const userRole = req.user.rol?.nombre || req.user.rol;
    if (userRole === 'AdministradorJC') {
      updateUsuarioDto.jcId = req.user.jcId;
    }
    return this.usuarioService.update(
      id,
      updateUsuarioDto,
      req.user,
      this.trazasService,
    );
  }

  @Delete(':id')
  @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
  async delete(@Param('id') id: number, @Req() req) {
    return this.usuarioService.delete(id, req.user, this.trazasService);
  }

  @Get('by_joven_club/:id_joven_club')
  @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
  async getUsuariosByJovenClub(
    @Param('id_joven_club') idJovenClub: string,
    @Req() req,
  ): Promise<Usuario[]> {
    let jcId = parseInt(idJovenClub);
    const userRole = req.user.rol?.nombre || req.user.rol;

    if (userRole === 'AdministradorJC') {
      jcId = req.user.jcId;
    }

    if (isNaN(jcId)) {
      throw new BadRequestException('ID de Joven Club inválido');
    }

    return this.usuarioService.findByIdJovenClub(jcId);
  }

  @Get('by_rol/:id_rol')
  @Roles('Administrador', 'AdministradorProv')
  async getUsuariosByRol(@Param('id_rol') idRol: string): Promise<Usuario[]> {
    const rolId = parseInt(idRol);
    if (isNaN(rolId)) {
      throw new BadRequestException('ID de Rol inválido');
    }
    return this.usuarioService.findByIdRol(rolId);
  }

  @Get('by_nombre_rol/:nombre_rol')
  @Roles('Administrador', 'AdministradorProv')
  async getUsuariosByNombreRol(
    @Param('nombre_rol') nombreRol: string,
  ): Promise<Usuario[]> {
    return this.usuarioService.findByNombreRol(nombreRol);
  }

  @Get('by_joven_club_and_rol/:id_joven_club')
  @Roles('Administrador', 'AdministradorProv', 'AdministradorJC')
  async getUsuariosByIdJovenClubAndNombreRol(
    @Param('id_joven_club', ParseIntPipe) idJovenClub: number,
    @Req() req,
  ): Promise<Usuario[]> {
    let jcId = idJovenClub;
    const userRole = req.user.rol?.nombre || req.user.rol;

    if (userRole === 'AdministradorJC') {
      jcId = req.user.jcId;
    }

    return this.usuarioService.findByIdJovenClubAndNombreRol(jcId);
  }

  @Get('generate/password/:length')
  @Roles('Administrador', 'AdministradorProv')
  async generatePassword(@Param('length') length: string): Promise<string> {
    const len = parseInt(length);
    if (isNaN(len)) {
      throw new BadRequestException('La longitud debe ser un número');
    }
    return this.usuarioService.generatePassword(len);
  }
}
