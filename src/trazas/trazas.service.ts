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
    console.log('=== TRAZAS SERVICE - CREATE ===');
    console.log('Datos recibidos:', JSON.stringify(data, null, 2));
    
    // Crear la traza explícitamente con cada campo
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
    
    console.log('Traza a guardar:', {
      usuarioEmail: traza.usuarioEmail,
      usuarioRol: traza.usuarioRol,
      accion: traza.accion,
      entidad: traza.entidad,
      entidadNombre: traza.entidadNombre,
      jcId: traza.jcId
    });
    
    const savedTraza = await this.trazasRepo.save(traza);
    console.log('✅ Traza guardada con ID:', savedTraza.id);
    
    return savedTraza;
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
    console.log(`📊 Se encontraron ${results.length} trazas`);
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