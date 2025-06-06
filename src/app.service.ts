import { Injectable } from '@nestjs/common';
import { PDFService } from '@t00nday/nestjs-pdf';

@Injectable()
export class AppService {
    constructor(
        // ...other dependencies...
        private readonly pdfService: PDFService,
    ) {}
}