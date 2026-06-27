import {
  Injectable,
  Inject,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './../dto/create-usuario.dto';
import { UpdateUsuarioDto } from './../dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';
import { randomInt } from 'crypto';
import { Rol } from '../../roles/entities/role.entity';
import { Jclub } from '../../jcs/entities/jc.entity';
import * as bcrypt from 'bcrypt';
import { Transactional } from '../../common/decorators/transactional.decorator';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(Usuario) private usuariosRepo: Repository<Usuario>,
    @Inject(REQUEST) private request: any,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepo
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .leftJoinAndSelect('usuario.jc', 'jc')
      .leftJoinAndSelect('jc.municipio', 'municipio')
      .leftJoinAndSelect('municipio.provincia', 'provincia')
      .orderBy('usuario.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepo
      .createQueryBuilder('usuario')
      .where('usuario.id = :id', { id })
      .leftJoinAndSelect('usuario.rol', 'rol')
      .leftJoinAndSelect('usuario.jc', 'jc')
      .leftJoinAndSelect('jc.municipio', 'municipio')
      .leftJoinAndSelect('municipio.provincia', 'provincia')
      .getOne();

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  @Transactional()
  async create(
    createUsuarioDto: CreateUsuarioDto,
    user?: any,
    trazasService?: any,
  ): Promise<Usuario> {
    const queryRunner = this.request.queryRunner;

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUsuarioDto.password, salt);

      const usuario = this.usuariosRepo.create({
        nombre: createUsuarioDto.nombre,
        apellidos: createUsuarioDto.apellidos,
        email: createUsuarioDto.email,
        password: hashedPassword,
        grupo_municipal: createUsuarioDto.grupo_municipal || false,
        rol: { id: createUsuarioDto.rolId } as Rol,
        jc: { id: createUsuarioDto.jcId } as Jclub,
        activo: true,
      });

      const savedUser = queryRunner
        ? await queryRunner.manager.save(usuario)
        : await this.usuariosRepo.save(usuario);

      if (trazasService && user) {
        await trazasService.create(
          {
            usuarioEmail: user.email,
            usuarioRol: user.rol?.nombre || user.rol,
            accion: 'CREATE',
            entidad: 'Usuario',
            entidadId: savedUser.id,
            entidadNombre: savedUser.nombre + ' ' + savedUser.apellidos,
            jcId: createUsuarioDto.jcId,
            detalles: {
              email: savedUser.email,
              rolId: createUsuarioDto.rolId,
              grupo_municipal: savedUser.grupo_municipal,
            },
          },
          queryRunner,
        );
        this.logger.log('Traza creada para CREATE Usuario');
      }

      return savedUser;
    } catch (error) {
      this.logger.error(`Error creando usuario: ${error.message}`);
      throw new HttpException(
        'Error al crear usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepo
      .createQueryBuilder('usuario')
      .where('usuario.email = :email', { email })
      .leftJoinAndSelect('usuario.rol', 'rol')
      .leftJoinAndSelect('usuario.jc', 'jc')
      .getOne();
  }

  @Transactional()
  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
    user?: any,
    trazasService?: any,
  ): Promise<Usuario> {
    const queryRunner = this.request.queryRunner;

    const usuario = await this.usuariosRepo
      .createQueryBuilder('usuario')
      .where('usuario.id = :id', { id })
      .leftJoinAndSelect('usuario.rol', 'rol')
      .leftJoinAndSelect('usuario.jc', 'jc')
      .getOne();

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const oldData = {
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rolId: usuario.rol?.id,
      jcId: usuario.jc?.id,
      grupo_municipal: usuario.grupo_municipal,
    };

    if (updateUsuarioDto.nombre !== undefined) {
      usuario.nombre = updateUsuarioDto.nombre;
    }
    if (updateUsuarioDto.apellidos !== undefined) {
      usuario.apellidos = updateUsuarioDto.apellidos;
    }
    if (updateUsuarioDto.email !== undefined) {
      usuario.email = updateUsuarioDto.email;
    }
    if (updateUsuarioDto.password !== undefined) {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(updateUsuarioDto.password, salt);
    }
    if (updateUsuarioDto.grupo_municipal !== undefined) {
      usuario.grupo_municipal = updateUsuarioDto.grupo_municipal;
    }
    if (updateUsuarioDto.activo !== undefined) {
      usuario.activo = updateUsuarioDto.activo;
    }
    if (updateUsuarioDto.rolId !== undefined) {
      usuario.rol = { id: updateUsuarioDto.rolId } as Rol;
    }
    if (updateUsuarioDto.jcId !== undefined) {
      usuario.jc = { id: updateUsuarioDto.jcId } as Jclub;
    }

    const updatedUser = queryRunner
      ? await queryRunner.manager.save(usuario)
      : await this.usuariosRepo.save(usuario);

    if (trazasService && user) {
      await trazasService.create(
        {
          usuarioEmail: user.email,
          usuarioRol: user.rol?.nombre || user.rol,
          accion: 'UPDATE',
          entidad: 'Usuario',
          entidadId: updatedUser.id,
          entidadNombre: updatedUser.nombre + ' ' + updatedUser.apellidos,
          jcId: updatedUser.jc?.id,
          detalles: {
            before: oldData,
            after: {
              nombre: updatedUser.nombre,
              apellidos: updatedUser.apellidos,
              email: updatedUser.email,
              rolId: updatedUser.rol?.id,
              jcId: updatedUser.jc?.id,
            },
          },
        },
        queryRunner,
      );
      this.logger.log('Traza creada para UPDATE Usuario');
    }

    return updatedUser;
  }

  @Transactional()
  async delete(id: number, user?: any, trazasService?: any): Promise<boolean> {
    const queryRunner = this.request.queryRunner;

    const usuario = await this.usuariosRepo
      .createQueryBuilder('usuario')
      .where('usuario.id = :id', { id })
      .leftJoinAndSelect('usuario.jc', 'jc')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .getOne();

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const userData = {
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      jcId: usuario.jc?.id,
    };

    if (queryRunner) {
      await queryRunner.manager.delete(Usuario, id);
    } else {
      await this.usuariosRepo.delete(id);
    }

    if (trazasService && user) {
      await trazasService.create(
        {
          usuarioEmail: user.email,
          usuarioRol: user.rol?.nombre || user.rol,
          accion: 'DELETE',
          entidad: 'Usuario',
          entidadId: id,
          entidadNombre: userData.nombre + ' ' + userData.apellidos,
          jcId: userData.jcId,
          detalles: userData,
        },
        queryRunner,
      );
      this.logger.log('Traza creada para DELETE Usuario');
    }

    return true;
  }

  async findByIdJovenClub(jc: number): Promise<Usuario[]> {
    return this.usuariosRepo
      .createQueryBuilder('usuario')
      .where('usuario.jc_id = :jcId', { jcId: jc })
      .leftJoinAndSelect('usuario.jc', 'jc')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .getMany();
  }

  async findByIdJovenClubAndNombreRol(jc: number): Promise<Usuario[]> {
    return this.usuariosRepo
      .createQueryBuilder('usuario')
      .innerJoinAndSelect('usuario.rol', 'rol')
      .where('rol.nombre = :nombre AND usuario.jc_id = :jcId', {
        nombre: 'AdministradorJC',
        jcId: jc,
      })
      .getMany();
  }

  async findByIdRol(rol: number): Promise<Usuario[]> {
    return this.usuariosRepo
      .createQueryBuilder('usuario')
      .where('usuario.rol_id = :rolId', { rolId: rol })
      .leftJoinAndSelect('usuario.jc', 'jc')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .getMany();
  }

  async findByNombreRol(nombre: string): Promise<Usuario[]> {
    return this.usuariosRepo
      .createQueryBuilder('usuario')
      .innerJoinAndSelect('usuario.rol', 'rol')
      .where('rol.nombre = :nombre', { nombre })
      .getMany();
  }

  generatePassword(length: number): string {
    const lowCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const rareLetters = 'áéíóúñüÁÉÍÓÚÑÜ';
    const digits = '0123456789';
    const signs = ',.;:/*+-_ ';
    const allSymbols =
      lowCaseLetters + upperCaseLetters + rareLetters + digits + signs;

    let password = '';
    const lowLetter = lowCaseLetters[randomInt(0, lowCaseLetters.length)];
    const upperLetter = upperCaseLetters[randomInt(0, upperCaseLetters.length)];
    const rareLetter = rareLetters[randomInt(0, rareLetters.length)];
    const digit = digits[randomInt(0, digits.length)];
    const sign = signs[randomInt(0, signs.length)];
    const forced = allSymbols[randomInt(0, allSymbols.length)];

    let rest = '';
    for (let i = 0; i < length - 6; i++) {
      rest += allSymbols[randomInt(0, allSymbols.length)];
    }

    let aux =
      lowLetter + upperLetter + rareLetter + digit + sign + forced + rest;

    while (aux.length > 0) {
      const index = aux.length > 1 ? randomInt(0, aux.length - 1) : 0;
      password += aux[index];
      aux = aux.substring(0, index) + aux.substring(index + 1, aux.length);
    }

    return password;
  }
}
