import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards , Res, Query, BadRequestException} from '@nestjs/common';
import { Request, Response, Application } from 'express';
import { cAccesosService} from '../services/caccesos.service';
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { cAccesos } from '../entities/caccesos.entity';
import { CreateAccesoDto } from '../dto/create-accesos.dto';

@Controller('api/accesos')
export class cAccesosController {

    constructor(
       private caccesosService: cAccesosService 
    ) {}
	
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.caccesosService.findAll();
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('filterby')
    async filterBy(
        @Query('nombrejc') nombrejc?: string,
        @Query('nombrepc') nombrepc?: string,
        @Query('causa') causa?: string,
        @Query('supervisor') supervisor?: string,
        @Query('tecnico') tecnico?: string,
        @Query('admin') admin?: string,
        @Query('inventario') inventario?: string,
    ):Promise<cAccesos[]>{
        let json = {}
        if (nombrejc) json['nombrejc'] = nombrejc;
        if (nombrepc) json['nombrepc'] = nombrepc;
        if (causa) json['causa'] = causa;
        if (supervisor) json['supervisor'] = supervisor;
        if (tecnico) json['tecnico'] = tecnico;
        if (admin) json['admin'] = admin;
        if (inventario) json['inventario'] = inventario;
        //console.log(json);
        
        return await this.caccesosService.findBy(json);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOne(@Param('id') id: number){
        return this.caccesosService.findOne(id);
        
    }



    @UseGuards(JwtAuthGuard)
    @Get('by/:json')
    async getBy(@Param('json') json: string):Promise<cAccesos[]>{
        return await this.caccesosService.findBy(JSON.parse(json));
    }


    @Post()
@UseGuards(JwtAuthGuard)
async create(@Body() createAccesoDto: CreateAccesoDto) {
  try {
    return await this.caccesosService.create(createAccesoDto);
  } catch (error) {
    throw new BadRequestException('Error al crear el acceso: ' + error.message);
  }
}

    @UseGuards(JwtAuthGuard)
    @Get('/export/pdf/:json')
    async getPDF(@Param('json') json: string, @Res() res: Response): Promise<void> {
        //routes.get('/pdf', FileController.show);
        const pdfStream = await this.caccesosService.generatePDF(JSON.parse(json));
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfStream),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=accesos.pdf',
        }).end(pdfStream);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/export/pdfbydaterange/:json')
    async getPDFByRange(@Param('json') json: string, @Res() res: Response): Promise<void> {
        //routes.get('/pdf', FileController.show);
        //console.log(json);
        const pdfStream = await this.caccesosService.generatePDFByRange(JSON.parse(json));
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfStream),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=accesos.pdf',
        }).end(pdfStream);
    }

    
    /*
    @Get('by_joven_club/:id_joven_club')
    async getComputadorasByJovenClub(@Param('id_joven_club') idJovenClub):Promise<Computadora[]>{
        return await this.pcService.findByIdJovenClub(idJovenClub);
    }
    @Get('by_nombre_joven_club/:nombre_joven_club')
    async getComputadorasByNombreJovenClub(@Param('nombre_joven_club') nombrejc):Promise<Computadora[]>{
        return await this.pcService.findByNombreJovenClub(nombre);
    }*/
	
}
