import { Municipio } from 'src/municipios/entities/municipio.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Jclub {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @ManyToOne(() => Municipio, municipio => municipio.id)
    municipio: Municipio

}