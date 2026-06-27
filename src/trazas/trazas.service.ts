import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Traza } from './entities/traza.entity';

@Injectable()
export class TrazasService {
  constructor(
    @InjectRepository(Traza)
    private trazasRepo: Repository<Traza>,
  ) {}

  async create(data: Partial<Traza>): Promise<Traza> {
    const traza = new Traza();
    traza.usuarioEmail = data.usuarioEmail || 'sistema';
    traza.usuarioRol = data.usuarioRol || 'sistema';
    traza.accion = data.accion || 'UNKNOWN';
    traza.entidad = data.entidad || 'Sistema';
    traza.entidadId = data.entidadId || null;
    traza.entidadNombre = data.entidadNombre || '';
    traza.jcId = data.jcId || null;
    traza.detalles = data.detalles || {};
    traza.fecha = new Date();
    
    return await this.trazasRepo.save(traza);
  }

  async findAll(filtros?: { jcId?: number; limit?: number; entidad?: string; accion?: string }): Promise<Traza[]> {
    const query = this.trazasRepo.createQueryBuilder('traza')
      .orderBy('traza.fecha', 'DESC');

    if (filtros?.limit) {
      query.take(filtros.limit);
    } else {
      query.take(50);
    }

    if (filtros?.jcId) {
      query.andWhere('traza.jcId = :jcId', { jcId: filtros.jcId });
    }

    if (filtros?.entidad) {
      query.andWhere('traza.entidad = :entidad', { entidad: filtros.entidad });
    }

    if (filtros?.accion) {
      query.andWhere('traza.accion = :accion', { accion: filtros.accion });
    }

    const results = await query.getMany();
    return results;
  }

  async findByJcId(jcId: number, limit: number = 50): Promise<Traza[]> {
    return this.trazasRepo.find({
      where: { jcId },
      order: { fecha: 'DESC' },
      take: limit,
    });
  }
}