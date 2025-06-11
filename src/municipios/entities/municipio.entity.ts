import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Provincia } from '../../provincias/entities/provincia.entity';

@Entity()
export class Municipio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ name: 'provincia_id' })
    provinciaId: number;

    @ManyToOne(() => Provincia, provincia => provincia.municipios)
    @JoinColumn({ name: 'provincia_id' })
    provincia: Provincia;
}