import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { funcionesRol } from '../entities/funcionesrole.entity';

@Injectable()
export class funcionesRolesService {
   constructor(
    @InjectRepository(funcionesRol) private tareasRepo: Repository <funcionesRol>
   ) {}

   findAll(){
      return this.tareasRepo.find();
   }
   findOne(id: number){
    return this.tareasRepo.findOne(id);
   }
   create(body: any){
       const nuevaTarea = this.tareasRepo.create(body);
       return this.tareasRepo.save(nuevaTarea);
   } 
   async update(id: number, body: any){
    const tarea = await this.tareasRepo.findOne(id);
    this.tareasRepo.merge(tarea, body);
    return this.tareasRepo.save(tarea);
   } 
   async delete(id: number){
    await this.tareasRepo.delete(id);
    return true;
   }
}
