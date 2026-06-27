import { Municipio } from '../../municipios/entities/municipio.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Computadora } from '../../pcs/entities/pc.entity';

@Entity()
export class Jclub {

    @PrimaryGeneratedColumn()
    id: number;

@Column()
nombre: string;

    @ManyToOne(() => Municipio, municipio => municipio.id)
    municipio: Municipio

    @OneToMany(() => Computadora, computadora => computadora.jc)

    computadoras: Computadora[];
}
