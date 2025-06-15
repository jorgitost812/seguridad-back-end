import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUsuarioDto } from './../dto/create-usuario.dto';
import { UpdateUsuarioDto } from './../dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';
import { randomInt } from 'crypto';
//import { runInThisContext } from 'vm';

@Injectable()
export class UsuariosService {
   constructor(
    @InjectRepository(Usuario) private usuariosRepo: Repository <Usuario>
   ) {}

   findAll(){
    console.log('Se mostraron todos los registros' );
      return this.usuariosRepo.find({relations: ['jc','rol','jc.municipio','jc.municipio.provincia'] });
   }
   findOne(id: number){
    console.log('Registro: '+ id +' fue consultado');
    return this.usuariosRepo.findOne({
      where: { id } as FindOptionsWhere<Usuario>,
      relations: ['jc', 'rol', 'jc.municipio', 'jc.municipio.provincia']
    });
   }
   async create(createUsuarioDto: CreateUsuarioDto) {
    console.log('Creating user with data:', createUsuarioDto);
    
    const usuario = this.usuariosRepo.create({
      nombre: createUsuarioDto.nombre,
      apellidos: createUsuarioDto.apellidos,
      email: createUsuarioDto.email,
      password: createUsuarioDto.password,
      grupo_municipal: createUsuarioDto.grupo_municipal || false,
      rol: { id: createUsuarioDto.rolId },
      jc: { id: createUsuarioDto.jcId },
      activo: true
    });

    return this.usuariosRepo.save(usuario);
 }
   async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepo.findOne({
      where: { email } as FindOptionsWhere<Usuario>
    });
  }

   async update(id: number, updateUsuarioDto: UpdateUsuarioDto){
      const tarea = await this.usuariosRepo.findOne({ where: { id } as FindOptionsWhere<Usuario> });
      this.usuariosRepo.merge(tarea, updateUsuarioDto);
      console.log('Usuario: '+ updateUsuarioDto.email +' fue actualizado');
      return this.usuariosRepo.save(tarea);
     } 

   async delete(id: number){
    await this.usuariosRepo.delete(id);
    console.log('registro: '+ id +' fue eliminado');
    return true;
   }

   findByIdJovenClub(jc: number): Promise<Usuario[]> {
    return this.usuariosRepo.find({
      where: { 
        jc: { id: jc } 
      } as FindOptionsWhere<Usuario>,
      relations: ['jc', 'rol']
    });
  }
  findByIdJovenClubAndNombreRol(jc): Promise<Usuario[]> {
    console.log('Busco '+jc+' ok' );
    return this.usuariosRepo.createQueryBuilder("usuario")
      .innerJoinAndSelect("usuario.rol", "rol")
      .where("rol.nombre = :nombre and usuario.jc = :jc", { nombre: "AdministradorJC", jc: jc })
      .getMany();
}
  findByIdMunicipioAndNombreRol(municipio): Promise<Usuario[]> {
  return this.usuariosRepo.createQueryBuilder("usuario")
    .innerJoinAndSelect("usuario.rol", "rol")
    .innerJoinAndSelect("usuario.jc", "jc")
    .innerJoinAndSelect("jc.municipio", "id")
    .where("rol.nombre = :nombre and jc.municipio = :municipio", { nombre: "DireccionMunicipal", municipio: municipio })
    .getMany();
}
  findByIdRol(rol): Promise<Usuario[]> {
      return this.usuariosRepo.find({ where: { rol: { id: rol } } as FindOptionsWhere<Usuario>, relations: ['jc','rol'] });
  }
  
  findByNombreRol(nombre): Promise<Usuario[]> {
      return this.usuariosRepo.createQueryBuilder("usuario")
      .innerJoinAndSelect("usuario.rol", "rol")
      .where("rol.nombre = :nombre", { nombre: nombre })
      .getMany();
  }

  generatePassword(length): any {
    var password = "";
    var lowCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    var upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var rareLetters = "áéíóúñüÁÉÍÓÚÑÜ";
    var digits = "0123456789";
    var signs = ",.;:/*+-_ ";
    var allSymbols = "asdfasdfabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZáéíóúñüÁÉÍÓÚÑÜ0123456789,.;:/*+-_ ";
    var lowLetter = lowCaseLetters[randomInt(0, lowCaseLetters.length)];
    var upperLetter = upperCaseLetters[randomInt(0, upperCaseLetters.length)];
    var rareLetter = rareLetters[randomInt(0, rareLetters.length)];
    var digit = digits[randomInt(0, digits.length)];
    var sign = signs[randomInt(0, signs.length)];
    var forced = allSymbols[randomInt(0, allSymbols.length)];
    var rest = "";
    for(var i = 0; i < length - 6; i++)
      rest += allSymbols[randomInt(0, allSymbols.length)];
    var aux = lowLetter + upperLetter + rareLetter + digit + sign + forced + rest;
    
    while(aux.length > 0)
    {
      var index = 0;
      if(aux.length > 1)
        index = randomInt(0, aux.length - 1);
      password += aux[index];
      var part1 = "";
      if(index > 0)
      part1 = aux.substring(0, index);
      var part2 = "";
      if(index < aux.length -1)
      part2 = aux.substring(index + 1, aux.length);
      aux = part1+part2;
    }
    return password;
  }
}
