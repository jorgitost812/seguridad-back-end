import { Injectable } from '@nestjs/common';

@Injectable()
export class PDFService {
   constructor(
   ) {}

   async generatePDF(): Promise<Buffer> {
      const PDFDocument = require('pdfkit');
      const fs = require('fs');
      
      const pdfBuffer: Buffer = await new Promise(resolve => {
        const doc = new PDFDocument({
          size: 'LETTER',
          bufferPages: true,
        })
  
        // customize your PDF document
        const content = 'Contenido del pdf.';
        doc.text(content, 100, 50)
        doc.end()
  
        const buffer = []
        doc.on('data', buffer.push.bind(buffer))
        doc.on('end', () => {
          const data = Buffer.concat(buffer)
          resolve(data)
        })
      })
  
      return pdfBuffer
    }
}
