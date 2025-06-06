import { Module } from '@nestjs/common';
import { PDFService } from './services/pdf.service';
import { PDFController } from './controllers/pdf.controller';
@Module({
  imports:[
  ],
  providers: [PDFService],
  controllers: [PDFController]
})
export class PDFModule {}
