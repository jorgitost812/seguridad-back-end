import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
=======
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
>>>>>>> master
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
import { ReportesModule } from './accesos/accesos.module';
import { TrazasModule } from './trazas/trazas.module';

@Module({
  imports: [
<<<<<<< HEAD
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'seguridad',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      migrationsRun: true,
      retryDelay: 3000,
      retryAttempts: 10
=======
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Rate Limiting: 100 requests per 1 minute for general endpoints
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100,
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        migrationsRun: true,
        retryDelay: 3000,
        retryAttempts: 10,
      }),
>>>>>>> master
    }),
    ProvinciasModule, MunicipiosModule, JovenclubModule, PcModule,cAccesosModule,iniSesionModule,  
    RolesModule,funcionesRolesModule, UsuariosModule, AuthModule, PDFModule,ReportesModule,TrazasModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
