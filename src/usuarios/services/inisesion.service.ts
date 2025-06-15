import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { iniSesion } from '../entities/inisesion.entity';

@Injectable()
export class iniSesionService {
    constructor(
        @InjectRepository(iniSesion) private inisesionRepo: Repository<iniSesion>
    ) {}

    findAll() {
        return this.inisesionRepo.find({
            order: { createdAt: 'DESC' }
        });
    }

    findOne(id: number) {
        return this.inisesionRepo.findOne({ where: { id } });
    }

    create(data: { email: string }) {
        const newSesion = this.inisesionRepo.create({
            email: data.email
        });
        return this.inisesionRepo.save(newSesion);
    }
}