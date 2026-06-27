import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jclub } from '../entities/jc.entity';

@Injectable()
export class JovenclubService {
  private readonly logger = new Logger(JovenclubService.name);

  constructor(
    @InjectRepository(Jclub) private jovenClubRepo: Repository<Jclub>,
  ) {}

  findAll() {
    return this.jovenClubRepo.find({ relations: ['municipio'] });
  }
  findOne(id: number) {
    return this.jovenClubRepo.findOne({
      where: { id },
      relations: ['municipio'],
    });
  }
  create(body: any) {
    const nuevaTarea = this.jovenClubRepo.create(body);
    return this.jovenClubRepo.save(nuevaTarea);
  }
  async update(id: number, body: any) {
    const tarea = await this.jovenClubRepo.findOne({ where: { id } });
    if (!tarea) {
      throw new NotFoundException('Joven Club no encontrado');
    }
    this.jovenClubRepo.merge(tarea, body);
    return this.jovenClubRepo.save(tarea);
  }
  async delete(id: number) {
    await this.jovenClubRepo.delete(id);
    return true;
  }
  findByIdMunicipio(municipio: string): Promise<Jclub[]> {
    return this.jovenClubRepo.find({
      where: {
        municipio: { id: parseInt(municipio, 10) },
      },
      relations: ['municipio'],
    });
  }
  findByNombreMunicipio(nombre: string): Promise<Jclub[]> {
    return this.jovenClubRepo
      .createQueryBuilder('jc')
      .innerJoinAndSelect('jc.municipio', 'municipio')
      .where('municipio.nombre = :nombre', { nombre })
      .getMany();
  }
}
