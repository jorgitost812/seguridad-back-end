import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { iniSesion } from '../entities/inisesion.entity';

@Injectable()
export class iniSesionService {
   constructor(
    	@InjectRepository(iniSesion) private inisesionRepo: Repository <iniSesion>
   ) {}

	findAll(){
      return this.inisesionRepo.find();
    }
    findOne(id: number){
    return this.inisesionRepo.findOne(id);
    }
	create(body: any){
      let newControl = {
         email: body.email
		}
            
       const nuevaTarea = this.inisesionRepo.create(newControl);
       return this.inisesionRepo.save(nuevaTarea);
   } 
}
