import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JovenclubService } from './services/jcs.service';
import { JovenclubController } from './controllers/jcs.controller';
import { Jclub } from './entities/jc.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([Jclub])
  ],
  providers: [JovenclubService],
  controllers: [JovenclubController]
})
export class JovenclubModule {}
