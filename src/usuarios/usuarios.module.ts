import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './services/usuarios.service';
import { UsuariosController } from './controllers/usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { JwtStrategy } from '../auth/jwt.strategy';
import { MailModule } from './../mail/mail.module';
import { TrazasModule } from '../trazas/trazas.module';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([Usuario]),
    TrazasModule, // ← IMPORTANTE: Agregar TrazasModule
  ],
  providers: [UsuariosService, JwtStrategy],
  controllers: [UsuariosController],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}
