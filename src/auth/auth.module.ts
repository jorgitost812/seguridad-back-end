import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { iniSesionModule } from '../usuarios/inisesion.module';

@Module({
  imports: [
    ConfigModule,
    UsuariosModule,
    PassportModule,
    iniSesionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
<<<<<<< HEAD
        signOptions: { expiresIn: '6h' },
=======
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') || '6h' },
>>>>>>> master
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}