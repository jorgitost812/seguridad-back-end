import { Get, Injectable, InternalServerErrorException, Logger, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { logger } from 'handlebars';
import { json } from 'stream/consumers';
import { getRepository, Repository } from 'typeorm';

import { cAccesos } from '../entities/caccesos.entity';
import { CreateAccesoDto } from '../dto/create-accesos.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Injectable()
export class cAccesosService {
  constructor(
    @InjectRepository(cAccesos)
    private caccesosRepo: Repository<cAccesos>
  ) {}

  async create(createAccesoDto: CreateAccesoDto) {
    try {
      const newAcceso = this.caccesosRepo.create({
        ...createAccesoDto,
        createdAt: new Date()
      });
      
      return await this.caccesosRepo.save(newAcceso);
    } catch (error) {
      throw new Error(`Error creating acceso: ${error.message}`);
    }
  }
  async findByJovenClub(jcId: string): Promise<cAccesos[]> {
    return await this.caccesosRepo.find({
      where: { nombrejc: jcId }
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    try {
      const accesos = await this.caccesosRepo.find({
        select: {
          nombrejc: true,
          nombrepc: true, 
          tecnico: true,
          supervisor: true,
          causa: true,
          createdAt: true
        },
        order: {
          createdAt: 'DESC'
        }
      });
      return accesos;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener accesos');
    }
  }
  findOne(id: number) {
    return this.caccesosRepo.findOne({ where: { id } });
  }

  findBy(filtro) {
    console.log('find2');
    var query = "";
    if (filtro.nombrejc) {
      if (query !== "")
        query += ",";
      query += "caccesos.nombrejc = '" + filtro.nombrejc + "'";
    }
    if (filtro.nombrepc) {
      if (query !== "")
        query += " and ";
      query += "caccesos.nombrepc = '" + filtro.nombrepc + "'";
    }
    if (filtro.causa) {
      if (query !== "")
        query += " and ";
      query += "caccesos.causa = '" + filtro.causa + "'";
    } if (filtro.supervisor) {
      if (query !== "")
        query += " and ";
      query += "caccesos.supervisor = '" + filtro.supervisor + "'";
    } if (filtro.tecnico) {
      if (query !== "")
        query += " and ";
      query += "caccesos.tecnico = '" + filtro.tecnico + "'";
    } if (filtro.admin) {
      if (query !== "")
        query += " and ";
      query += "caccesos.admin = '" + filtro.admin + "'";
    }

    //return query;

    return getRepository(cAccesos).createQueryBuilder().select("caccesos").from(cAccesos, "caccesos").where(query).getMany();

    /*var json = {"causa":"",
       "nombrejc":"nombrejc",
       "nombrepc":"nombrepc",
       "supervisor":"",
       "tecnico":"",
       "admin":""};
    var query = "";
    if(json.causa)
    query+="{ where: { nombrejc: " + json.nombrepc + "}}";
    return this.caccesosRepo.find(query);
    //return this.caccesosRepo.find({ where: { nombrejc: nombrejc}} && { where: { nombrepc: nombrepc}});*/
  }

  findByRange(filtro) {
    console.log('find3');
    var query = "caccesos.createdAt between " + "'" + filtro.desde + "'" + " and " + "'" + filtro.hasta + "'" + "";

    //return query;
    //Logger.log(query);

    return getRepository(cAccesos).createQueryBuilder().select("caccesos").from(cAccesos, "caccesos").where(query).getMany();

    /*var json = {"causa":"",
       "nombrejc":"nombrejc",
       "nombrepc":"nombrepc",
       "supervisor":"",
       "tecnico":"",
       "admin":""};
    var query = "";
    if(json.causa)
    query+="{ where: { nombrejc: " + json.nombrepc + "}}";
    return this.caccesosRepo.find(query);
    //return this.caccesosRepo.find({ where: { nombrejc: nombrejc}} && { where: { nombrepc: nombrepc}});*/
  }


  createControl(body: any) {
    let newControl = {
      nombrejc: body.nombrejc,
      nombrepc: body.nombrepc,
      admin: body.admin,
      tecnico: body.tecnico,
      supervisor: body.supervisor,
      causa: body.causa,
      inventario: body.inventario
    }

    const nuevaTarea = this.caccesosRepo.create(newControl);
    return this.caccesosRepo.save(nuevaTarea);
  }


  async generatePDF(filtro): Promise<Buffer> {
    var json = {
      "causa": "",
      "nombrejc": "",
      "nombrepc": "",
      "inventario": "",
      "supervisor": "",
      "tecnico": "",
      "admin": ""
    };

    var list = this.findBy(filtro);

    var array = [];
    //var dato = 0;

    for (var value of (await list).values()) {
      array.push(value);
    }
    /*
          for(var i = 0; i < (await list).length; i++)
          {
             array.push((await list).pop());
             dato += i;
          }
    */
    var json2 = JSON.stringify(array);

    //const PDFDocument = require('pdfkit');
    const PDFDocument = require("pdfkit-table");
    const fs = require('fs');

    const table = {
      title: "ACCESOS",
      //subtitle: "Subtitle",
      headers: [
        { label: "Joven Club", property: 'nombrejc', width: 80, renderer: null },
        { label: "Computadora", property: 'nombrepc', width: 80, renderer: null },
        { label: "Administrador", property: 'admin', width: 80, renderer: null },
        { label: "Causa", property: 'causa', width: 80, renderer: null },
        { label: "Supervisor", property: 'supervisor', width: 80, renderer: null },
        { label: "Invemtario", property: 'inventario', width: 80, renderer: null },
        {
          label: "Técnico", property: 'tecnico', width: 80,
          renderer: (value, indexColumn, indexRow, row) => { return value /*`U$ ${Number(value).toFixed(2)}`*/ }
        },
      ],
      // complex data
      datas:
        JSON.parse(json2)
      /*[
        { 
          name: 'Name 1', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ante in laoreet egestas. ', 
          price1: '$1', 
          price3: '$ 3', 
          price2: '$2', 
          price4: '4', 
        }
        ,
        { 
          options: { fontSize: 10, separation: true},
          name: 'bold:Name 2', 
          description: 'bold:Lorem ipsum dolor.', 
          price1: 'bold:$1', 
          price3: { 
            label: 'PRICE $3', options: { fontSize: 12 } 
          }, 
          price2: '$2', 
          price4: '4', 
        },
        // {...},
      ]*/

      /*,
       // simeple data
       rows: [
         [
           "Apple",
           "Nullam ut facilisis mi. Nunc dignissim ex ac vulputate facilisis.",
           "$ 105,99",
           "$ 105,99",
           "$ 105,99",
           "105.99",
         ],
         // [...],
       ],*/
    };



    const pdfBuffer: Buffer = await new Promise(resolve => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'LETTER',
        bufferPages: true,
      })

      // customize your PDF document
      //const content = 'Contenido del pdf.';
      //doc.text(dato, 50, 50)

      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(8);
          /*indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15);*/
        },
      });

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


  async generatePDFByRange(filtro): Promise<Buffer> {
    //console.log(filtro.desde);
    var json = {
      "causa": "",
      "nombrejc": "jc",
      "nombrepc": "",
      "inventario": "",
      "supervisor": "",
      "tecnico": "",
      "admin": ""
    };

    var list = this.findByRange(filtro);

    var array = [];
    //var dato = 0;

    for (var value of (await list).values()) {
      array.push(value);
    }
    /*
          for(var i = 0; i < (await list).length; i++)
          {
             array.push((await list).pop());
             dato += i;
          }
    */
    var json2 = JSON.stringify(array);

    //const PDFDocument = require('pdfkit');
    const PDFDocument = require("pdfkit-table");
    const fs = require('fs');

    const table = {
      title: "ACCESOS",
      //subtitle: "Subtitle",
      headers: [
        { label: "Joven Club", property: 'nombrejc', width: 80, renderer: null },
        { label: "Computadora", property: 'nombrepc', width: 80, renderer: null },
        { label: "Administrador", property: 'admin', width: 80, renderer: null },
        { label: "Causa", property: 'causa', width: 80, renderer: null },
        { label: "Supervisor", property: 'supervisor', width: 80, renderer: null },
        { label: "Invemtario", property: 'inventario', width: 80, renderer: null },
        {
          label: "Técnico", property: 'tecnico', width: 80,
          renderer: (value, indexColumn, indexRow, row) => { return value /*`U$ ${Number(value).toFixed(2)}`*/ }
        },
      ],
      // complex data
      datas:
        JSON.parse(json2)
      /*[
        { 
          name: 'Name 1', 
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ante in laoreet egestas. ', 
          price1: '$1', 
          price3: '$ 3', 
          price2: '$2', 
          price4: '4', 
        }
        ,
        { 
          options: { fontSize: 10, separation: true},
          name: 'bold:Name 2', 
          description: 'bold:Lorem ipsum dolor.', 
          price1: 'bold:$1', 
          price3: { 
            label: 'PRICE $3', options: { fontSize: 12 } 
          }, 
          price2: '$2', 
          price4: '4', 
        },
        // {...},
      ]*/

      /*,
       // simeple data
       rows: [
         [
           "Apple",
           "Nullam ut facilisis mi. Nunc dignissim ex ac vulputate facilisis.",
           "$ 105,99",
           "$ 105,99",
           "$ 105,99",
           "105.99",
         ],
         // [...],
       ],*/
    };



    const pdfBuffer: Buffer = await new Promise(resolve => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'LETTER',
        bufferPages: true,
      })

      // customize your PDF document
      //const content = 'Contenido del pdf.';
      //doc.text(dato, 50, 50)

      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(8);
          /*indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15);*/
        },
      });

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


  //Este es de juan m de prueba
  findByTest(filtro) {
    var query = "caccesos.createdAt >= '" + filtro.desde + "' and caccesos.createdAt <= '" + filtro.hasta + "'";
    /* if(filtro.nombrejc)
     {
        if(query !== "")
           query += ",";
        query += "caccesos.nombrejc = '" + filtro.nombrejc+"'";
     }
     if(filtro.nombrepc)
     {
        if(query !== "")
        query += " and ";
        query += "caccesos.nombrepc = '" + filtro.nombrepc+"'";
     }
     if(filtro.causa)
     {
        if(query !== "")
        query += " and ";
        query += "caccesos.causa = '" + filtro.causa+"'";
     }if(filtro.supervisor)
     {
        if(query !== "")
        query += " and ";
        query += "caccesos.supervisor = '" + filtro.supervisor+"'";
     }if(filtro.tecnico)
     {
        if(query !== "")
        query += " and ";
        query += "caccesos.tecnico = '" + filtro.tecnico+"'";
     }if(filtro.admin)
     {
        if(query !== "")
        query += " and ";
        query += "caccesos.admin = '" + filtro.admin+"'";
     }*/

    //return query;

    return getRepository(cAccesos).createQueryBuilder().select("caccesos").from(cAccesos, "caccesos").where(query).getMany();
  }

}
