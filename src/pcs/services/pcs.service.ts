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
   
     async create(body: any, jcId?: number, user?: any, trazasService?: any){
     // Encrypt passwords if provided as plain text
     let pwd = body.pwd || {};
     let setupPwd = body.setupPwd || {};
     if (body.admin && body.admin !== '') {
       pwd = encrypt(body.admin);
     }
     if (body.setup && body.setup !== '') {
       setupPwd = encrypt(body.setup);
     }

     const newPC = {
         nombre: body.nombre,
         numero: body.numero,
         ip: body.ip,
         jc: { id: jcId || body.jcId },
         pwd,
         setupPwd
     }
    
    const nuevaTarea = this.pcsRepo.create(newPC);
    const savedPC = await this.pcsRepo.save(nuevaTarea);
    
    if (trazasService) {
        const emailUsuario = user?.email || 'sistema';
        const rolUsuario = user?.rol || 'sistema';
        const nombreComputadora = savedPC?.nombre || 'sin_nombre';
        const idJc = jcId || body.jcId || 0;
        
        const trazaData = {
            usuarioEmail: emailUsuario,
            usuarioRol: rolUsuario,
            accion: 'CREATE',
            entidad: 'Computadora',
            entidadId: savedPC.id,
            entidadNombre: nombreComputadora,
            jcId: idJc,
            detalles: { 
                nombre: savedPC.nombre, 
                numero: savedPC.numero, 
                ip: savedPC.ip 
            }
        };
        
        await trazasService.create(trazaData);
    }
    
    return savedPC;
}
   
   async update(id: number, body: any, jcId?: number, user?: any, trazasService?: any){
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

     // Guardar datos antiguos para la traza
     const oldData = { 
        nombre: pc.nombre, 
        numero: pc.numero, 
        ip: pc.ip 
     };

      if (body.admin && body.admin !== '') {
        body.pwd = encrypt(body.admin);
        delete body.admin;
      } else if (!body.pwd) {
        delete body.pwd;
      }
      if (body.setup && body.setup !== '') {
        body.setupPwd = encrypt(body.setup);
        delete body.setup;
      } else if (!body.setupPwd) {
        delete body.setupPwd;
      }

     this.pcsRepo.merge(pc, body);
     const updatedPC = await this.pcsRepo.save(pc);
     
     // Insertar traza
     if (trazasService && user) {
        await trazasService.create({
           usuarioEmail: user.email,
           usuarioRol: user.rol?.nombre || user.rol,
           accion: 'UPDATE',
           entidad: 'Computadora',
           entidadId: updatedPC.id,
           entidadNombre: updatedPC.nombre,
           jcId: jcId || body.jcId,
           detalles: { 
              before: oldData, 
              after: { 
                 nombre: updatedPC.nombre, 
                 numero: updatedPC.numero, 
                 ip: updatedPC.ip 
              } 
           }
        });
     }
     
     return updatedPC;
   } 
   
   async delete(id: number, jcId?: number, user?: any, trazasService?: any) {
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
       
       const pcData = { 
          nombre: pc.nombre, 
          numero: pc.numero, 
          ip: pc.ip 
       };
       
       await this.pcsRepo.remove(pc);
       
       // Insertar traza
       if (trazasService && user) {
          await trazasService.create({
             usuarioEmail: user.email,
             usuarioRol: user.rol?.nombre || user.rol,
             accion: 'DELETE',
             entidad: 'Computadora',
             entidadId: id,
             entidadNombre: pcData.nombre,
             jcId: jcId,
             detalles: pcData
          });
       }
       
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