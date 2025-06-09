import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rol } from '../entities/role.entity';

@Injectable()
export class RolesService {
   constructor(
    @InjectRepository(Rol) private tareasRepo: Repository <Rol>
   ) {}

   findAll(){
      return this.tareasRepo.find();
   }
   findOne(id: number) {
      return this.tareasRepo.findOne({ 
        where: { id }
      });
    }
   create(body: any){
       const nuevaTarea = this.tareasRepo.create(body);
       return this.tareasRepo.save(nuevaTarea);
   } 
   async update(id: number, body: any){
    const tarea = await this.tareasRepo.findOne({ 
      where: { id }
    });
    this.tareasRepo.merge(tarea, body);
    return this.tareasRepo.save(tarea);
   } 
   async delete(id: number){
    await this.tareasRepo.delete(id);
    return true;
   }
}
