import { Module } from '@nestjs/common';
import { AuthController } from "./auth.controller";
import { AuthService} from './auth.service';
import { UsuariosModule } from "../usuarios/usuarios.module";
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { MailModule } from './../mail/mail.module';

@Module({
    imports: [
        UsuariosModule,
        PassportModule,
        MailModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '6h' },
          }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    //exports: [AuthService]
})
export class AuthModule {}
