import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { cAccesos } from '../entities/caccesos.entity';
import { CreateAccesoDto } from '../dto/create-accesos.dto';

@Injectable()
export class cAccesosService {
  private readonly logger = new Logger(cAccesosService.name);

  constructor(
    @InjectRepository(cAccesos)
    private caccesosRepo: Repository<cAccesos>,
  ) {}

  async create(createAccesoDto: CreateAccesoDto): Promise<cAccesos> {
    try {
      const newAcceso = this.caccesosRepo.create({
        ...createAccesoDto,
        createdAt: new Date(),
      });

      return await this.caccesosRepo.save(newAcceso);
    } catch (error) {
      this.logger.error(`Error creating acceso: ${error.message}`);
      throw new InternalServerErrorException('Error al crear acceso');
    }
  }

  async findByJovenClub(jcId: string): Promise<cAccesos[]> {
    return this.caccesosRepo.find({
      where: { nombrejc: jcId },
    });
  }

  async findAll(): Promise<cAccesos[]> {
    try {
      return await this.caccesosRepo.find({
        select: {
          nombrejc: true,
          nombrepc: true,
          tecnico: true,
          supervisor: true,
          causa: true,
          createdAt: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      this.logger.error(`Error fetching accesos: ${error.message}`);
      throw new InternalServerErrorException('Error al obtener accesos');
    }
  }

  async findOne(id: number): Promise<cAccesos | null> {
    return this.caccesosRepo.findOne({ where: { id } });
  }

<<<<<<< HEAD
  findBy(filtro) {
    const qb = this.caccesosRepo.createQueryBuilder('caccesos');
    const conditions = [
      { key: 'nombrejc', field: 'caccesos.nombrejc' },
      { key: 'nombrepc', field: 'caccesos.nombrepc' },
      { key: 'causa', field: 'caccesos.causa' },
      { key: 'supervisor', field: 'caccesos.supervisor' },
      { key: 'tecnico', field: 'caccesos.tecnico' },
      { key: 'admin', field: 'caccesos.admin' },
    ];

    let first = true;
    for (const { key, field } of conditions) {
      if (filtro[key]) {
        if (first) {
          qb.where(`${field} = :${key}`, { [key]: filtro[key] });
          first = false;
        } else {
          qb.andWhere(`${field} = :${key}`, { [key]: filtro[key] });
        }
      }
    }

    return qb.getMany();
  }

  findByRange(filtro) {
    return this.caccesosRepo.createQueryBuilder('caccesos')
=======
  async findBy(filtro: Record<string, string>): Promise<cAccesos[]> {
    const queryBuilder = this.caccesosRepo.createQueryBuilder('caccesos');

    const conditions: Record<string, string> = {};
    if (filtro.nombrejc) conditions.nombrejc = filtro.nombrejc;
    if (filtro.nombrepc) conditions.nombrepc = filtro.nombrepc;
    if (filtro.causa) conditions.causa = filtro.causa;
    if (filtro.supervisor) conditions.supervisor = filtro.supervisor;
    if (filtro.tecnico) conditions.tecnico = filtro.tecnico;
    if (filtro.admin) conditions.admin = filtro.admin;

    Object.entries(conditions).forEach(([key, value], index) => {
      const paramName = `param_${key}`;
      if (index === 0) {
        queryBuilder.where(`caccesos.${key} = :${paramName}`, {
          [paramName]: value,
        });
      } else {
        queryBuilder.andWhere(`caccesos.${key} = :${paramName}`, {
          [paramName]: value,
        });
      }
    });

    return queryBuilder.getMany();
  }

  async findByRange(filtro: {
    desde: string;
    hasta: string;
  }): Promise<cAccesos[]> {
    return this.caccesosRepo
      .createQueryBuilder('caccesos')
>>>>>>> master
      .where('caccesos.createdAt BETWEEN :desde AND :hasta', {
        desde: filtro.desde,
        hasta: filtro.hasta,
      })
      .getMany();
  }

  createControl(body: any): Promise<cAccesos> {
    const newControl = {
      nombrejc: body.nombrejc,
      nombrepc: body.nombrepc,
      admin: body.admin,
      tecnico: body.tecnico,
      supervisor: body.supervisor,
      causa: body.causa,
      inventario: body.inventario,
    };

    const nuevaTarea = this.caccesosRepo.create(newControl);
    return this.caccesosRepo.save(nuevaTarea);
  }

  async generatePDF(filtro: Record<string, string>): Promise<Buffer> {
    const list = await this.findBy(filtro);
    const array = Array.from(list);

    const PDFDocument = require('pdfkit-table');

    const table = {
      title: 'ACCESOS',
      headers: [
        {
          label: 'Joven Club',
          property: 'nombrejc',
          width: 80,
          renderer: null,
        },
        {
          label: 'Computadora',
          property: 'nombrepc',
          width: 80,
          renderer: null,
        },
        {
          label: 'Administrador',
          property: 'admin',
          width: 80,
          renderer: null,
        },
        { label: 'Causa', property: 'causa', width: 80, renderer: null },
        {
          label: 'Supervisor',
          property: 'supervisor',
          width: 80,
          renderer: null,
        },
        {
          label: 'Inventario',
          property: 'inventario',
          width: 80,
          renderer: null,
        },
        { label: 'Técnico', property: 'tecnico', width: 80, renderer: null },
      ],
      datas: array,
    };

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'LETTER',
        bufferPages: true,
      });

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8),
        prepareRow: () => {
          doc.font('Helvetica').fontSize(8);
        },
      });

      doc.end();

      const buffer: Buffer[] = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        resolve(Buffer.concat(buffer));
      });
    });

    return pdfBuffer;
  }

  async generatePDFByRange(filtro: {
    desde: string;
    hasta: string;
  }): Promise<Buffer> {
    const list = await this.findByRange(filtro);
    const array = Array.from(list);

    const PDFDocument = require('pdfkit-table');

    const table = {
      title: 'ACCESOS',
      headers: [
        {
          label: 'Joven Club',
          property: 'nombrejc',
          width: 80,
          renderer: null,
        },
        {
          label: 'Computadora',
          property: 'nombrepc',
          width: 80,
          renderer: null,
        },
        {
          label: 'Administrador',
          property: 'admin',
          width: 80,
          renderer: null,
        },
        { label: 'Causa', property: 'causa', width: 80, renderer: null },
        {
          label: 'Supervisor',
          property: 'supervisor',
          width: 80,
          renderer: null,
        },
        {
          label: 'Inventario',
          property: 'inventario',
          width: 80,
          renderer: null,
        },
        { label: 'Técnico', property: 'tecnico', width: 80, renderer: null },
      ],
      datas: array,
    };

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        margin: 30,
        size: 'LETTER',
        bufferPages: true,
      });

      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8),
        prepareRow: () => {
          doc.font('Helvetica').fontSize(8);
        },
      });

      doc.end();

      const buffer: Buffer[] = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        resolve(Buffer.concat(buffer));
      });
    });

    return pdfBuffer;
  }
<<<<<<< HEAD


  findByTest(filtro) {
    return this.caccesosRepo.createQueryBuilder('caccesos')
      .where('caccesos.createdAt >= :desde AND caccesos.createdAt <= :hasta', {
        desde: filtro.desde,
        hasta: filtro.hasta,
      })
      .getMany();
  }

=======
>>>>>>> master
}
