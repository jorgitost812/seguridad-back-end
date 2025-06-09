import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipio } from '../../municipios/entities/municipio.entity';
import { Jclub } from '../entities/jc.entity';

@Injectable()
export class JovenclubService {
   constructor(
    @InjectRepository(Jclub) private jovenClubRepo: Repository <Jclub>) {}

   findAll(){
      return this.jovenClubRepo.find({relations: ['municipio'] });
   }
   findOne(id: number) {
    return this.jovenClubRepo.findOne({
      where: { id },
      relations: ['municipio']
    });
  }
   create(body: any){
       const nuevaTarea = this.jovenClubRepo.create(body);
       return this.jovenClubRepo.save(nuevaTarea);
   } 
   async update(id: number, body: any){
    const tarea = await this.jovenClubRepo.findOne({ where: { id } });
    this.jovenClubRepo.merge(tarea, body);
    return this.jovenClubRepo.save(tarea);
   } 
   async delete(id: number){
    await this.jovenClubRepo.delete(id);
    return true;
   }
   findByIdMunicipio(municipio): Promise<Jclub[]> {
      return this.jovenClubRepo.find({ where: { municipio: municipio }, relations: ['municipio'] });
  }
  findByNombreMunicipio(nombre): Promise<Jclub[]> {
      return this.jovenClubRepo.createQueryBuilder("jc")
      .innerJoinAndSelect("jc.municipio", "municipio")
      .where("municipio.nombre = :nombre", { nombre: nombre })
      .getMany();
  }
}
