import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Municipio } from '../entities/municipio.entity';

@Injectable()
export class MunicipiosService {
   constructor(
    @InjectRepository(Municipio) private municipioRepo: Repository <Municipio>
   ) {}

   findAll(){
      return this.municipioRepo.find({relations: ['provincia'] });
   }
   findOne(id: number){
    return this.municipioRepo.findOne({
      where: { id },
      relations: ['provincia']
    });
   }
   create(body: any){
       const nuevoMunicipio = this.municipioRepo.create(body);
       return this.municipioRepo.save(nuevoMunicipio);
   } 
   async update(id: number, body: any){
    const municipio = await this.municipioRepo.findOne({ where: { id } });
    this.municipioRepo.merge(municipio, body);
    return this.municipioRepo.save(municipio);
   } 
   async delete(id: number){
    await this.municipioRepo.delete(id);
    return "Municipio Eliminado";
   }
   findByIdProvincia(provincia): Promise<Municipio[]> {
      return this.municipioRepo.find({ where: { provincia: provincia }, relations: ['provincia'] });
  }
}
