import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {encrypt} from '../../helpers/crypto.helper'

import { Computadora } from '../entities/pc.entity';


@Injectable()
export class PcService {
   constructor(
    @InjectRepository(Computadora) private pcsRepo: Repository <Computadora>,
	
   ) {}
// Computadoras
   findAll(){
      return this.pcsRepo.find({relations: ['jc'] });
   }
   findOne(id: number){
    return this.pcsRepo.findOne({
      where: { id },
      relations: ['jc']
    });
   }
   create(body: any){
      let newPC = {
         nombre: body.nombre,
         numero: body.numero,
         ip: body.ip,
         jc: body.jc,
         pwd: {},
         setupPwd: {}
      }
      newPC.pwd = encrypt(body.admin)
      newPC.setupPwd = encrypt(body.setup)
      
       const nuevaTarea = this.pcsRepo.create(newPC);
       return this.pcsRepo.save(nuevaTarea);
   } 
   async update(id: number, body: any){
    const tarea = await this.pcsRepo.findOne({ where: { id } });
    this.pcsRepo.merge(tarea, body);
    return this.pcsRepo.save(tarea);
   } 
   async delete(id: number){
    await this.pcsRepo.delete(id);
    return true;
   }

   findByIdJovenClub(jc): Promise<Computadora[]> {
      return this.pcsRepo.find({ where: { jc: jc }, relations: ['jc']});
  }  

  findByNombreJovenClub(nombre): Promise<Computadora[]> {
   return this.pcsRepo.createQueryBuilder("computadora")
   .innerJoinAndSelect("computadora.jc", "jovenClub")
   .where("jovenClub.nombre = :nombre", { nombre: nombre })
   .getMany();
}

}
