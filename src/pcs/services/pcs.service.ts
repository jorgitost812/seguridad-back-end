import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { encrypt } from '../../helpers/crypto.helper'
import { Computadora } from '../entities/pc.entity';

@Injectable()
export class PcService {
   private readonly logger = new Logger(PcService.name);

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
   
<<<<<<< HEAD
    async create(body: any, jcId?: number, user?: any, trazasService?: any){
     console.log('=== PC SERVICE - CREATE ===');
     
     let newPC = {
         nombre: body.nombre,
         numero: body.numero,
         ip: body.ip,
         jc: { id: jcId || body.jcId },
         pwd: body.pwd || {},
         setupPwd: body.setupPwd || {}
     }
=======
   async create(body: any, jcId?: number, user?: any, trazasService?: any){
    this.logger.debug(`Creating new PC: nombre=${body.nombre}`);
    
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
>>>>>>> master
    
    const nuevaTarea = this.pcsRepo.create(newPC);
    const savedPC = await this.pcsRepo.save(nuevaTarea);
    
    this.logger.log(`PC created: id=${savedPC.id}, nombre=${savedPC.nombre}`);
    
    // Insertar traza - asegurar que los datos NO sean undefined
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
        this.logger.log(`Audit trace created for CREATE PC: ${savedPC.id}`);
    }
    
    return savedPC;
}
   
   async update(id: number, body: any, jcId?: number, user?: any, trazasService?: any){
     this.logger.debug(`Updating PC: id=${id}`);
     
     const pc = await this.pcsRepo.findOne({ 
       where: { id },
       relations: ['jc']
     });

     if (!pc) {
       this.logger.warn(`Update failed: PC no encontrada - ${id}`);
       throw new NotFoundException('PC no encontrada');
     }

     if (jcId && pc.jc?.id !== jcId) {
       this.logger.warn(`Update failed: Permission denied for PC - ${id}`);
       throw new BadRequestException('No tienes permiso para editar esta PC');
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
     
     this.logger.log(`PC updated: id=${updatedPC.id}, nombre=${updatedPC.nombre}`);
     
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
        this.logger.log(`Audit trace created for UPDATE PC: ${updatedPC.id}`);
     }
     
     return updatedPC;
   } 
   
   async delete(id: number, jcId?: number, user?: any, trazasService?: any) {
     this.logger.debug(`Deleting PC: id=${id}`);
     
     try {
       const pc = await this.pcsRepo.findOne({ 
         where: { id },
         relations: ['jc', 'accesos'] 
       });
   
       if (!pc) {
         this.logger.warn(`Delete failed: PC no encontrada - ${id}`);
         throw new NotFoundException('PC no encontrada');
       }
   
       if (jcId && pc.jc?.id !== jcId) {
         this.logger.warn(`Delete failed: Permission denied for PC - ${id}`);
         throw new BadRequestException('No tienes permiso para eliminar esta PC');
       }
       
       const pcData = { 
          nombre: pc.nombre, 
          numero: pc.numero, 
          ip: pc.ip 
       };
       
       await this.pcsRepo.remove(pc);
       
       this.logger.log(`PC deleted: id=${id}, nombre=${pcData.nombre}`);
       
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
          this.logger.log(`Audit trace created for DELETE PC: ${id}`);
       }
       
       return true;
     } catch (error) {
       this.logger.error(`Error deleting PC: ${error.message}`);
       throw new BadRequestException(`Error al eliminar PC: ${error.message}`);
     }
   }

   async findByJovenClub(idJc: number): Promise<Computadora[]> {
     if (!idJc) {
       this.logger.warn(`FindByJovenClub failed: ID de Joven Club requerido`);
       throw new BadRequestException('ID de Joven Club requerido');
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