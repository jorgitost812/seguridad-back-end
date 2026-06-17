import {
  Injectable,
  UnauthorizedException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidatedUserDto } from './dto/validated-user.dto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidatedUserDto | null> {
    if (!email || !password) {
      throw new HttpException(
        'Email y contraseña son requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.warn('Invalid login attempt: user not found');
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      this.logger.warn('Invalid login attempt: wrong password');
      return null;
    }

    this.logger.log('User authenticated successfully');
    return ValidatedUserDto.fromUsuario(user);
  }

  async login(loginUserDto: LoginUserDto) {
    this.logger.log('Login attempt received');

    try {
      const user = await this.validateUser(
        loginUserDto.email,
        loginUserDto.password,
      );

      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const payload: JwtPayload = {
        email: user.email,
        sub: user.id,
        rol: user.rol?.nombre,
        jcId: user.jc?.id,
      };

      this.logger.log('Login successful');

      return {
        statusCode: 200,
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          rol: user.rol,
          nombre: user.nombre,
          apellidos: user.apellidos,
          jc: user.jc,
        },
      };
    } catch (error) {
      this.logger.warn('Login failed');
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }
}
