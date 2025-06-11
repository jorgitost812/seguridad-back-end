import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Acceso } from '../entities/accesos.entity';


@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Acceso)
    private accesoRepository: Repository<Acceso>
  ) {}

  async findByJC(nombrejc: string): Promise<Acceso[]> {
    return this.accesoRepository.find({
      where: { nombrejc },
      relations: ['pc']
    });
  }

  async getReportePC(idJovenClub: number) {
    return this.accesoRepository
      .createQueryBuilder('acceso')
      .innerJoinAndSelect('acceso.pc', 'pc')
      .innerJoinAndSelect('pc.jc', 'jc')
      .where('jc.id = :idJovenClub', { idJovenClub })
      .getMany();
  }
}