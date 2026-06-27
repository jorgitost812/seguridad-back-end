import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rol } from '../entities/role.entity';
import { CreateRolDto } from '../dto/create-rol.dto';
import { UpdateRolDto } from '../dto/update-rol.dto';

@Injectable()
export class RolesService {
   constructor(
    @InjectRepository(Rol) private rolRepo: Repository<Rol>
   ) {}

   findAll(){
      return this.rolRepo.find();
   }
   findOne(id: number) {
      return this.rolRepo.findOne({ 
        where: { id }
      });
    }
   create(createRolDto: CreateRolDto){
       const rol = this.rolRepo.create(createRolDto);
       return this.rolRepo.save(rol);
   } 
   async update(id: number, updateRolDto: UpdateRolDto){
    const rol = await this.rolRepo.findOne({ 
      where: { id }
    });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
    this.rolRepo.merge(rol, updateRolDto);
    return this.rolRepo.save(rol);
   } 
   async delete(id: number){
    const rol = await this.rolRepo.findOne({ 
      where: { id }
    });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no encontrado`);
    }
    await this.rolRepo.delete(id);
    return true;
   }
}
