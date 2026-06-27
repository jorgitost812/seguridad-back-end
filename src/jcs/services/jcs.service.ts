import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipio } from '../../municipios/entities/municipio.entity';
import { Jclub } from '../entities/jc.entity';
import { CreateJcDto } from '../dto/create-jc.dto';
import { UpdateJcDto } from '../dto/update-jc.dto';

@Injectable()
export class JovenclubService {
   constructor(
    @InjectRepository(Jclub) private jovenClubRepo: Repository<Jclub>) {}

   findAll(){
      return this.jovenClubRepo.find({relations: ['municipio'] });
   }
   findOne(id: number) {
    return this.jovenClubRepo.findOne({
      where: { id },
      relations: ['municipio']
    });
  }
   create(createJcDto: CreateJcDto){
       const jc = this.jovenClubRepo.create({
         nombre: createJcDto.nombre,
         municipio: { id: createJcDto.municipioId } as Municipio
       });
       return this.jovenClubRepo.save(jc);
   } 
   async update(id: number, updateJcDto: UpdateJcDto){
    const jc = await this.jovenClubRepo.findOne({ where: { id } });
    if (!jc) {
      throw new NotFoundException(`Joven Club con id ${id} no encontrado`);
    }
    if (updateJcDto.nombre !== undefined) {
      jc.nombre = updateJcDto.nombre;
    }
    if (updateJcDto.municipioId !== undefined) {
      jc.municipio = { id: updateJcDto.municipioId } as Municipio;
    }
    return this.jovenClubRepo.save(jc);
   } 
   async delete(id: number){
    const jc = await this.jovenClubRepo.findOne({ where: { id } });
    if (!jc) {
      throw new NotFoundException(`Joven Club con id ${id} no encontrado`);
    }
    await this.jovenClubRepo.delete(id);
    return true;
   }
   findByIdMunicipio(municipio): Promise<Jclub[]> {
    return this.jovenClubRepo.find({ 
        where: { 
            municipio: { id: municipio } 
        }, 
        relations: ['municipio'] 
    });
}
  findByNombreMunicipio(nombre): Promise<Jclub[]> {
      return this.jovenClubRepo.createQueryBuilder("jc")
      .innerJoinAndSelect("jc.municipio", "municipio")
      .where("municipio.nombre = :nombre", { nombre: nombre })
      .getMany();
  }
}
