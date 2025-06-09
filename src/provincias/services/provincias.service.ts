import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Provincia } from './../entities/provincia.entity';

@Injectable()
export class ProvinciasService {
   constructor(
    @InjectRepository(Provincia) private tareasRepo: Repository <Provincia>
   ) {}

   findAll(){
      return this.tareasRepo.find();
      if(!Provincia) throw new NotFoundException('No hay Provincias')
        return Provincia;
   }
   findOne(id: number){
      if(id) throw new NotFoundException('No hay Provincias')
      return this.tareasRepo.findOne({ where: { id } });
   }
   create(body: any){
       const nuevaTarea = this.tareasRepo.create(body);
       return this.tareasRepo.save(nuevaTarea);
   } 
   async update(id: number, body: any){
    const tarea = await this.tareasRepo.findOne({ where: { id } });
    this.tareasRepo.merge(tarea, body);
    return this.tareasRepo.save(tarea);
   } 
   async delete(id: number){
    await this.tareasRepo.delete(id);
    return true;
   }
}