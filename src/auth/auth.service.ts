import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "./dto/login-user.dto";
import { UsuariosService } from "src/usuarios/services/usuarios.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsuariosService,
        private jwtService: JwtService
    ) {}

    async validateUser(usuario: string, password: string): Promise<any> {
        try {
            const user = await this.usersService.findByEmail(usuario);
            if(!user) {
                console.log('Usuario no registrado');
                return false;
            } 
            const validPassword = user.checkIfUnencryptedPasswordIsValid(password);
            if(!validPassword) {
                console.log('Contraseña incorrecta');
                return false;
            }
            return user;
        } catch(e) {
            console.error('Error validating user:', e);
            throw e;
        }
    }

    async login(loginUserDto: LoginUserDto) {
        try {
            const {usuario, password} = loginUserDto;
            const user = await this.validateUser(usuario, password);
            
            if(!user) {
                return {
                    statusCode: 401,
                    message: 'Login incorrecto'
                };
            }
            
            const payload = {email: user.email, sub: user.id};
            return {
                access_token: this.jwtService.sign(payload)
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async getProfile(user: any) {
      try {
          const userProfile = await this.usersService.findByEmail(user.email);
          return userProfile;
      } catch (error) {
          console.error('Error getting profile:', error);
          throw error;
      }
  }
}