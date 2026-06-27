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
        
        if (user) {
          const isValid = await bcrypt.compare(password, user.password);
          
          if (isValid) {
            const { password, ...result } = user;
            return result;
          }
        }
        return null;
    }

    async login(loginUserDto: LoginUserDto) {
        try {
            const user = await this.validateUser(loginUserDto.email, loginUserDto.password);
            
            if (!user) {
                throw new UnauthorizedException('Credenciales inválidas');
            }

            const payload = { 
                email: user.email, 
                sub: user.id,
                rol: user.rol?.nombre,
                jcId: user.jc?.id
            };

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
            throw new UnauthorizedException('Credenciales inválidas');
        }
    }
}