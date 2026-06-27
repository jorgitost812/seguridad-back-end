import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Municipio } from '../../municipios/entities/municipio.entity';

@Entity()
export class Provincia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'varchar', length: 20})
    nombre: string;

    @OneToMany(() => Municipio, municipio => municipio.provincia)
    municipios: Municipio[];
}