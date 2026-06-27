import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Provincia } from './../entities/provincia.entity';
import { CreateProvinciaDto } from '../dto/create-provincia.dto';
import { UpdateProvinciaDto } from '../dto/update-provincia.dto';

@Injectable()
export class ProvinciasService {
   constructor(
    @InjectRepository(Provincia) private provinciaRepo: Repository<Provincia>
   ) {}

   findAll(){
      return this.provinciaRepo.find();
   }
   async findOne(id: number){
      const provincia = await this.provinciaRepo.findOne({ where: { id } });
      if (!provincia) {
        throw new NotFoundException(`Provincia con id ${id} no encontrada`);
      }
      return provincia;
   }
   create(createProvinciaDto: CreateProvinciaDto){
       const provincia = this.provinciaRepo.create(createProvinciaDto);
       return this.provinciaRepo.save(provincia);
   } 
   async update(id: number, updateProvinciaDto: UpdateProvinciaDto){
    const provincia = await this.provinciaRepo.findOne({ where: { id } });
    if (!provincia) {
      throw new NotFoundException(`Provincia con id ${id} no encontrada`);
    }
    this.provinciaRepo.merge(provincia, updateProvinciaDto);
    return this.provinciaRepo.save(provincia);
   } 
   async delete(id: number){
    const provincia = await this.provinciaRepo.findOne({ where: { id } });
    if (!provincia) {
      throw new NotFoundException(`Provincia con id ${id} no encontrada`);
    }
    await this.provinciaRepo.delete(id);
    return true;
   }
}
