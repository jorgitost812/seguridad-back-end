import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { JovenclubModule } from './jcs/jcs.module';
import { PcModule } from './pcs/pcs.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { TrazasModule } from './trazas/trazas.module';
import { InventarioModule } from './inventario/inventario.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'inventario',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      retryDelay: 3000,
      retryAttempts: 10
    }),
    JovenclubModule,
    PcModule,
    UsuariosModule,
    AuthModule,
    TrazasModule,
    InventarioModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}