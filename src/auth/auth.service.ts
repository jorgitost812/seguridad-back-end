import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsuariosService } from "src/usuarios/services/usuarios.service";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsuariosService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        console.log('Found user:', user ? 'Yes' : 'No');
        
        if (user) {
          console.log('Stored hashed password:', user.password);
          console.log('Attempting to validate password:', password);
          const isValid = await bcrypt.compare(password, user.password);
          console.log('Password validation result:', isValid);
          
          if (isValid) {
            const { password, ...result } = user;
            return result;
          }
        }
        return null;
    }

    async login(loginUserDto: LoginUserDto) {
        console.log('Login attempt for:', loginUserDto.email);
        try {
            const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
            
            if (!user) {
                throw new UnauthorizedException('Credenciales inválidas');
            }

            const payload = { 
                email: user.email, 
                sub: user.id,
                rol: user.rol?.nombre 
            };

            // Modificado para incluir más información del usuario
            return {
                statusCode: 200,
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    rol: user.rol,
                    nombre: user.nombre,
                    apellidos: user.apellidos,
                    jc: user.jc
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            throw new UnauthorizedException('Credenciales inválidas');
        }
    }
}