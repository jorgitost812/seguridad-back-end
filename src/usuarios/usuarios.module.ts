import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './services/usuarios.service';
import { UsuariosController } from './controllers/usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { UsuarioSubscriber } from "./usuarios.subscriber";
import { JwtStrategy } from "../auth/jwt.strategy";
import { MailModule } from './../mail/mail.module';
//import { createFirstUser } from "../helpers/primer.usuario";

@Module({
  imports:[
    MailModule,
    TypeOrmModule.forFeature([Usuario])
  ],
  providers: [UsuariosService, JwtStrategy, UsuarioSubscriber],
  controllers: [UsuariosController],
  exports: [TypeOrmModule, UsuariosService]
})
export class UsuariosModule {}
