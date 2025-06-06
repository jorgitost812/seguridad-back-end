import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards , Res} from '@nestjs/common';
import { Request, Response, Application } from 'express';
import { PDFService} from '../services/pdf.service';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller('api/export')
export class PDFController {

    constructor(
       private caccesosService: PDFService 
    ) {}
	
    @UseGuards(JwtAuthGuard)
    @Get('/pdf')
    async getPDF(
      @Res() res: Response,
    ): Promise<void> {
        //routes.get('/pdf', FileController.show);
        const pdfStream = await this.caccesosService.generatePDF();
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfStream),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=accesos.pdf',
        }).end(pdfStream);
    }
}
