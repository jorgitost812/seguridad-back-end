import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { encrypt } from '../../helpers/crypto.helper'
import { Computadora } from '../entities/pc.entity';

@Injectable()
export class PcService {
   constructor(
    @InjectRepository(Computadora) private pcsRepo: Repository <Computadora>,
   ) {}
   
   findAll(){
      return this.pcsRepo.find({relations: ['jc'] });
   }
   
   findOne(id: number, jcId?: number){
     return this.pcsRepo.findOne({
       where: { id },
       relations: ['jc']
     });
   }
   
   create(body: any, jcId?: number){
      let newPC = {
         nombre: body.nombre,
         numero: body.numero,
         ip: body.ip,
         jc: { id: jcId || body.jcId },
         pwd: {},
         setupPwd: {}
      }
      
      if (body.admin && body.admin !== '') {
         newPC.pwd = encrypt(body.admin);
      }
      if (body.setup && body.setup !== '') {
         newPC.setupPwd = encrypt(body.setup);
      }
       
      const nuevaTarea = this.pcsRepo.create(newPC);
      return this.pcsRepo.save(nuevaTarea);
   } 
   
   async update(id: number, body: any, jcId?: number){
     const pc = await this.pcsRepo.findOne({ 
       where: { id },
       relations: ['jc']
     });

     if (!pc) {
       throw new Error('PC no encontrada');
     }

     if (jcId && pc.jc?.id !== jcId) {
       throw new Error('No tienes permiso para editar esta PC');
     }

     if (body.admin && body.admin !== '') {
       body.pwd = encrypt(body.admin);
       delete body.admin;
     }
     if (body.setup && body.setup !== '') {
       body.setupPwd = encrypt(body.setup);
       delete body.setup;
     }

     this.pcsRepo.merge(pc, body);
     return this.pcsRepo.save(pc);
   } 
   
   async delete(id: number, jcId?: number) {
     try {
       const pc = await this.pcsRepo.findOne({ 
         where: { id },
         relations: ['jc', 'accesos'] 
       });
   
       if (!pc) {
         throw new Error('PC no encontrada');
       }
   
       if (jcId && pc.jc?.id !== jcId) {
         throw new Error('No tienes permiso para eliminar esta PC');
       }
   
       await this.pcsRepo.remove(pc);
       return true;
     } catch (error) {
       throw new Error(`Error al eliminar PC: ${error.message}`);
     }
   }

   async findByJovenClub(idJc: number): Promise<Computadora[]> {
     if (!idJc) {
       throw new Error('ID de Joven Club requerido');
     }
   
     return this.pcsRepo.find({
       where: {
         jc: { id: idJc }
       },
       relations: ['jc']
     });
   }

   findByNombreJovenClub(nombre: string): Promise<Computadora[]> {
     return this.pcsRepo.createQueryBuilder("computadora")
       .innerJoinAndSelect("computadora.jc", "jovenClub")
       .where("jovenClub.nombre = :nombre", { nombre: nombre })
       .getMany();
   }
}