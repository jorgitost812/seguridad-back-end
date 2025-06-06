
import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import {LoginUserDto} from './dto/login-user.dto';
import { MailModule } from './../mail/mail.module';
import { IsNull } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsuariosService,
      private jwtService: JwtService
      //private mailService: MailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
        const user = await this.usersService.findByEmail(email);
        if(!user) {
          console.log('Usuario no registrado');
          return false; //{status: 404, message: 'usuario no encontrado !!!'};
        } 
        const aa =user.checkIfUnencryptedPasswordIsValid(password);
        if(!aa){
            console.log('Contraseña incorrecta');
            return false; //throw {status: 401, message: 'contraseña incorrecta !!!'} 
        }
        return user;
      } catch(e){
        throw e;
      }
  }

  async login(loginUserDto: LoginUserDto){
    try {
      const {email, password} = loginUserDto;
      const user = await this.validateUser(email, password)
      if(!user) return {messge: 'Login  incorrecto...'}
      
      const payload = {email: user.email, sub: user.id};
      console.log("Usuario: " + payload.email + " autenticado");
      return {
        access_token: this.jwtService.sign(payload)
        }
        

    } catch (error) {
      
      throw error
    }
  }  
  
}
