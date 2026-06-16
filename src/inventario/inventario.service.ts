import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { TrazasService } from '../trazas/trazas.service';
import { Jclub } from '../jcs/entities/jc.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepo: Repository<Inventario>,
    private trazasService: TrazasService,
  ) {}

  async findAll(): Promise<Inventario[]> {
    return this.inventarioRepo.find({
      relations: ['ubicacion'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Inventario> {
    const item = await this.inventarioRepo.findOne({
      where: { id },
      relations: ['ubicacion'],
    });
    if (!item) throw new NotFoundException(`Item #${id} no encontrado`);
    return item;
  }

  async findByJovenClub(jcId: number): Promise<Inventario[]> {
    return this.inventarioRepo.find({
      where: { ubicacion: { id: jcId } },
      relations: ['ubicacion'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateInventarioDto, user: any): Promise<Inventario> {
    const newItem = this.inventarioRepo.create({
      nombre: dto.nombre,
      estado: dto.estado || 'Bueno',
      precio: dto.precio || 0,
      ubicacion: { id: dto.jcId } as Jclub,
    });
    const savedItem = await this.inventarioRepo.save(newItem);

    await this.trazasService.create({
      usuarioEmail: user?.email || 'admin',
      usuarioRol: user?.rol || 'Administrador',
      accion: 'CREATE',
      entidad: 'Inventario',
      entidadId: savedItem.id,
      entidadNombre: savedItem.nombre,
      jcId: dto.jcId,
      detalles: {
        nombre: savedItem.nombre,
        estado: savedItem.estado,
        precio: savedItem.precio,
      },
    });
    return savedItem;
  }

  async update(
    id: number,
    dto: UpdateInventarioDto,
    user: any,
  ): Promise<Inventario> {
    const item = await this.findOne(id);
    const oldData = {
      nombre: item.nombre,
      estado: item.estado,
      precio: item.precio,
    };

    if (dto.nombre !== undefined) item.nombre = dto.nombre;
    if (dto.estado !== undefined) item.estado = dto.estado;
    if (dto.precio !== undefined) item.precio = dto.precio;
    if (dto.jcId !== undefined) item.ubicacion = { id: dto.jcId } as Jclub;

    const updatedItem = await this.inventarioRepo.save(item);

    await this.trazasService.create({
      usuarioEmail: user?.email || 'admin',
      usuarioRol: user?.rol || 'Administrador',
      accion: 'UPDATE',
      entidad: 'Inventario',
      entidadId: updatedItem.id,
      entidadNombre: updatedItem.nombre,
      jcId: updatedItem.ubicacion?.id,
      detalles: {
        before: oldData,
        after: {
          nombre: updatedItem.nombre,
          estado: updatedItem.estado,
          precio: updatedItem.precio,
        },
      },
    });
    return updatedItem;
  }

  async delete(id: number, user: any): Promise<void> {
    const item = await this.findOne(id);
    const itemData = {
      nombre: item.nombre,
      estado: item.estado,
      precio: item.precio,
      jcId: item.ubicacion?.id,
    };
    await this.inventarioRepo.remove(item);

    await this.trazasService.create({
      usuarioEmail: user?.email || 'admin',
      usuarioRol: user?.rol || 'Administrador',
      accion: 'DELETE',
      entidad: 'Inventario',
      entidadId: id,
      entidadNombre: itemData.nombre,
      jcId: itemData.jcId,
      detalles: itemData,
    });
  }
}
