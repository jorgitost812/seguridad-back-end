import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { encrypt } from '../../helpers/crypto.helper';
import { Computadora } from '../entities/pc.entity';

@Injectable()
export class PcService {
  constructor(
    @InjectRepository(Computadora) private pcsRepo: Repository<Computadora>,
  ) {}

  findAll() {
    return this.pcsRepo.find({ relations: ['jc'] });
  }

  findOne(id: number) {
    return this.pcsRepo.findOne({ where: { id }, relations: ['jc'] });
  }

  async create(body: any, jcId?: number, user?: any, trazasService?: any) {
    let newPC = {
      nombre: body.nombre,
      numero: body.numero,
      ip: body.ip,
      jc: { id: jcId || body.jcId },
      pwd: {},
      setupPwd: {},
    };

    if (body.admin && body.admin !== '') {
      newPC.pwd = encrypt(body.admin);
    }
    if (body.setup && body.setup !== '') {
      newPC.setupPwd = encrypt(body.setup);
    }

    const nuevaTarea = this.pcsRepo.create(newPC);
    const savedPC = await this.pcsRepo.save(nuevaTarea);

    if (trazasService) {
      await trazasService.create({
        usuarioEmail: user?.email || 'admin',
        usuarioRol: user?.rol || 'Administrador',
        accion: 'CREATE',
        entidad: 'Computadora',
        entidadId: savedPC.id,
        entidadNombre: savedPC.nombre,
        jcId: jcId || body.jcId,
        detalles: {
          nombre: savedPC.nombre,
          numero: savedPC.numero,
          ip: savedPC.ip,
        },
      });
    }

    return savedPC;
  }

  async update(
    id: number,
    body: any,
    jcId?: number,
    user?: any,
    trazasService?: any,
  ) {
    const pc = await this.pcsRepo.findOne({ where: { id }, relations: ['jc'] });
    if (!pc) throw new Error('PC no encontrada');

    const oldData = { nombre: pc.nombre, numero: pc.numero, ip: pc.ip };

    if (body.admin && body.admin !== '') {
      body.pwd = encrypt(body.admin);
      delete body.admin;
    }
    if (body.setup && body.setup !== '') {
      body.setupPwd = encrypt(body.setup);
      delete body.setup;
    }

    this.pcsRepo.merge(pc, body);
    const updatedPC = await this.pcsRepo.save(pc);

    if (trazasService) {
      await trazasService.create({
        usuarioEmail: user?.email || 'admin',
        usuarioRol: user?.rol || 'Administrador',
        accion: 'UPDATE',
        entidad: 'Computadora',
        entidadId: updatedPC.id,
        entidadNombre: updatedPC.nombre,
        jcId: jcId,
        detalles: {
          before: oldData,
          after: {
            nombre: updatedPC.nombre,
            numero: updatedPC.numero,
            ip: updatedPC.ip,
          },
        },
      });
    }

    return updatedPC;
  }

  async delete(id: number, jcId?: number, user?: any, trazasService?: any) {
    const pc = await this.pcsRepo.findOne({ where: { id }, relations: ['jc'] });
    if (!pc) throw new Error('PC no encontrada');

    const pcData = { nombre: pc.nombre, numero: pc.numero, ip: pc.ip };
    await this.pcsRepo.remove(pc);

    if (trazasService) {
      await trazasService.create({
        usuarioEmail: user?.email || 'admin',
        usuarioRol: user?.rol || 'Administrador',
        accion: 'DELETE',
        entidad: 'Computadora',
        entidadId: id,
        entidadNombre: pcData.nombre,
        jcId: jcId,
        detalles: pcData,
      });
    }

    return true;
  }

  async findByJovenClub(idJc: number): Promise<Computadora[]> {
    return this.pcsRepo.find({
      where: { jc: { id: idJc } },
      relations: ['jc'],
    });
  }
}
