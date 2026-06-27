import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUsuarioDto } from './../dto/create-usuario.dto';
import { UpdateUsuarioDto } from './../dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';
import { randomInt } from 'crypto';
import { Rol } from '../../roles/entities/role.entity';
import { Jclub } from '../../jcs/entities/jc.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
   constructor(
    @InjectRepository(Usuario) private usuariosRepo: Repository <Usuario>
   ) {}

   findAll(){
      return this.usuariosRepo.find({relations: ['jc','rol','jc.municipio','jc.municipio.provincia'] });
   }
   
   findOne(id: number){
      return this.usuariosRepo.findOne({
        where: { id } as FindOptionsWhere<Usuario>,
        relations: ['jc', 'rol', 'jc.municipio', 'jc.municipio.provincia']
      });
   }

   async create(createUsuarioDto: CreateUsuarioDto, user?: any, trazasService?: any) {
      // Password hashing handled by @BeforeInsert hook in Usuario entity
      const usuario = this.usuariosRepo.create({
         nombre: createUsuarioDto.nombre,
         apellidos: createUsuarioDto.apellidos,
         email: createUsuarioDto.email,
         password: createUsuarioDto.password,
         grupo_municipal: createUsuarioDto.grupo_municipal || false,
         rol: { id: createUsuarioDto.rolId } as Rol,
         jc: { id: createUsuarioDto.jcId } as Jclub,
         activo: true
      });

      const savedUser = await this.usuariosRepo.save(usuario);
      
      // Insertar traza
      if (trazasService && user) {
         await trazasService.create({
            usuarioEmail: user.email,
            usuarioRol: user.rol?.nombre || user.rol,
            accion: 'CREATE',
            entidad: 'Usuario',
            entidadId: savedUser.id,
            entidadNombre: savedUser.nombre + ' ' + savedUser.apellidos,
            jcId: createUsuarioDto.jcId,
            detalles: { 
               email: savedUser.email,
               rolId: createUsuarioDto.rolId,
               grupo_municipal: savedUser.grupo_municipal
            }
         });
      }
      
      return savedUser;
   }
   
   async findByEmail(email: string): Promise<Usuario | null> {
      return this.usuariosRepo.findOne({
        where: { email } as FindOptionsWhere<Usuario>,
        relations: ['rol', 'jc']
      });
   }

   async update(id: number, updateUsuarioDto: UpdateUsuarioDto, user?: any, trazasService?: any){
      const usuario = await this.usuariosRepo.findOne({ 
        where: { id } as FindOptionsWhere<Usuario>,
        relations: ['rol', 'jc']
      });
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      
      const oldData = {
         nombre: usuario.nombre,
         apellidos: usuario.apellidos,
         email: usuario.email,
         rolId: usuario.rol?.id,
         jcId: usuario.jc?.id,
         grupo_municipal: usuario.grupo_municipal
      };
      
      if (updateUsuarioDto.nombre !== undefined) {
        usuario.nombre = updateUsuarioDto.nombre;
      }
      if (updateUsuarioDto.apellidos !== undefined) {
        usuario.apellidos = updateUsuarioDto.apellidos;
      }
      if (updateUsuarioDto.email !== undefined) {
        usuario.email = updateUsuarioDto.email;
      }
      if (updateUsuarioDto.password !== undefined) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(updateUsuarioDto.password, salt);
      }
      if (updateUsuarioDto.grupo_municipal !== undefined) {
        usuario.grupo_municipal = updateUsuarioDto.grupo_municipal;
      }
      if (updateUsuarioDto.activo !== undefined) {
        usuario.activo = updateUsuarioDto.activo;
      }
      if (updateUsuarioDto.rolId !== undefined) {
        usuario.rol = { id: updateUsuarioDto.rolId } as Rol;
      }
      if (updateUsuarioDto.jcId !== undefined) {
        usuario.jc = { id: updateUsuarioDto.jcId } as Jclub;
      }
      
      const updatedUser = await this.usuariosRepo.save(usuario);
      
      // Insertar traza
      if (trazasService && user) {
         await trazasService.create({
            usuarioEmail: user.email,
            usuarioRol: user.rol?.nombre || user.rol,
            accion: 'UPDATE',
            entidad: 'Usuario',
            entidadId: updatedUser.id,
            entidadNombre: updatedUser.nombre + ' ' + updatedUser.apellidos,
            jcId: updatedUser.jc?.id,
            detalles: { before: oldData, after: { 
               nombre: updatedUser.nombre,
               apellidos: updatedUser.apellidos,
               email: updatedUser.email,
               rolId: updatedUser.rol?.id,
               jcId: updatedUser.jc?.id
            }}
         });
      }
      
      return updatedUser;
   } 

   async delete(id: number, user?: any, trazasService?: any){
      const usuario = await this.usuariosRepo.findOne({ 
        where: { id } as FindOptionsWhere<Usuario>,
        relations: ['jc', 'rol']
      });
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      
      const userData = {
         nombre: usuario.nombre,
         apellidos: usuario.apellidos,
         email: usuario.email,
         jcId: usuario.jc?.id
      };
      
      await this.usuariosRepo.delete(id);
      
      // Insertar traza
      if (trazasService && user) {
         await trazasService.create({
            usuarioEmail: user.email,
            usuarioRol: user.rol?.nombre || user.rol,
            accion: 'DELETE',
            entidad: 'Usuario',
            entidadId: id,
            entidadNombre: userData.nombre + ' ' + userData.apellidos,
            jcId: userData.jcId,
            detalles: userData
         });
      }
      
      return true;
   }

   findByIdJovenClub(jc: number): Promise<Usuario[]> {
      return this.usuariosRepo.find({
        where: { jc: { id: jc } } as FindOptionsWhere<Usuario>,
        relations: ['jc', 'rol']
      });
   }
   
   findByIdJovenClubAndNombreRol(jc: number): Promise<Usuario[]> {
      return this.usuariosRepo.createQueryBuilder("usuario")
        .innerJoinAndSelect("usuario.rol", "rol")
        .where("rol.nombre = :nombre and usuario.jc = :jc", { nombre: "AdministradorJC", jc: jc })
        .getMany();
   }
   
   findByIdRol(rol: number): Promise<Usuario[]> {
      return this.usuariosRepo.find({ where: { rol: { id: rol } } as FindOptionsWhere<Usuario>, relations: ['jc','rol'] });
   }
   
   findByNombreRol(nombre: string): Promise<Usuario[]> {
      return this.usuariosRepo.createQueryBuilder("usuario")
        .innerJoinAndSelect("usuario.rol", "rol")
        .where("rol.nombre = :nombre", { nombre: nombre })
        .getMany();
   }

   generatePassword(length: number): string {
      const lowCaseLetters = "abcdefghijklmnopqrstuvwxyz";
      const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const rareLetters = "áéíóúñüÁÉÍÓÚÑÜ";
      const digits = "0123456789";
      const signs = ",.;:/*+-_ ";
      const allSymbols = lowCaseLetters + upperCaseLetters + rareLetters + digits + signs;
      
      const lowLetter = lowCaseLetters[randomInt(0, lowCaseLetters.length)];
      const upperLetter = upperCaseLetters[randomInt(0, upperCaseLetters.length)];
      const rareLetter = rareLetters[randomInt(0, rareLetters.length)];
      const digit = digits[randomInt(0, digits.length)];
      const sign = signs[randomInt(0, signs.length)];
      const forced = allSymbols[randomInt(0, allSymbols.length)];
      let rest = "";
      
      for(let i = 0; i < length - 6; i++)
         rest += allSymbols[randomInt(0, allSymbols.length)];
         
      let aux = lowLetter + upperLetter + rareLetter + digit + sign + forced + rest;
      let password = "";
      
      while(aux.length > 0) {
         const index = aux.length > 1 ? randomInt(0, aux.length - 1) : 0;
         password += aux[index];
         aux = aux.substring(0, index) + aux.substring(index + 1, aux.length);
      }
      
      return password;
   }
}