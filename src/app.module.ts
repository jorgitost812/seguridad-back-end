import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ProvinciasModule } from './provincias/provincias.module';
import { RolesModule } from './roles/roles.module';
import { funcionesRolesModule } from './funcionesroles/funcionesroles.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { JovenclubModule } from './jcs/jcs.module';
import { PcModule } from './pcs/pcs.module';
import { cAccesosModule } from './pcs/caccesos.module';
import { iniSesionModule } from './usuarios/inisesion.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { PDFModule } from './pdf/pdf.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'seguridad',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      retryDelay: 3000,
      retryAttempts: 10
    }),
    ProvinciasModule, MunicipiosModule, JovenclubModule, PcModule,cAccesosModule,iniSesionModule,  
    RolesModule,funcionesRolesModule, UsuariosModule, AuthModule, PDFModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
