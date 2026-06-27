import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Municipio } from '../entities/municipio.entity';
import { Provincia } from '../../provincias/entities/provincia.entity';
import { CreateMunicipioDto } from '../dto/create-municipio.dto';
import { UpdateMunicipioDto } from '../dto/update-municipio.dto';

@Injectable()
export class MunicipiosService {
   constructor(
    @InjectRepository(Municipio) private municipioRepo: Repository<Municipio>
   ) {}

   findAll(){
      return this.municipioRepo.find({relations: ['provincia'] });
   }
   findOne(id: number){
    return this.municipioRepo.findOne({
      where: { id },
      relations: ['provincia']
    });
   }
   create(createMunicipioDto: CreateMunicipioDto){
       const municipio = this.municipioRepo.create({
         nombre: createMunicipioDto.nombre,
         provincia: { id: createMunicipioDto.provinciaId } as Provincia
       });
       return this.municipioRepo.save(municipio);
   } 
   async update(id: number, updateMunicipioDto: UpdateMunicipioDto){
    const municipio = await this.municipioRepo.findOne({ where: { id } });
    if (!municipio) {
      throw new NotFoundException(`Municipio con id ${id} no encontrado`);
    }
    if (updateMunicipioDto.nombre !== undefined) {
      municipio.nombre = updateMunicipioDto.nombre;
    }
    if (updateMunicipioDto.provinciaId !== undefined) {
      municipio.provincia = { id: updateMunicipioDto.provinciaId } as Provincia;
    }
    return this.municipioRepo.save(municipio);
   } 
   async delete(id: number){
    const municipio = await this.municipioRepo.findOne({ where: { id } });
    if (!municipio) {
      throw new NotFoundException(`Municipio con id ${id} no encontrado`);
    }
    await this.municipioRepo.delete(id);
    return true;
   }
   async findByProvincia(provinciaId: number): Promise<Municipio[]> {
    return this.municipioRepo.find({
      where: { provincia: { id: provinciaId } },
      relations: ['provincia'],
    });
  }
}
