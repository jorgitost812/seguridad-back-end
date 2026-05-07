import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { iniSesionModule } from '../usuarios/inisesion.module';
import { JcGuard } from './jc.guard';

@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    iniSesionModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JcGuard],
  exports: [AuthService, JcGuard],
})
export class AuthModule {}