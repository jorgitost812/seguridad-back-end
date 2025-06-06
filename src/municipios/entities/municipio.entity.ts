import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Provincia } from '../../provincias/entities/provincia.entity'


@Entity()
export class Municipio {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @ManyToOne(() => Provincia, provincia => provincia.id)
    provincia: Provincia

}