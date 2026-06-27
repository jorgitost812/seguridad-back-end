import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Municipio } from '../../municipios/entities/municipio.entity';

@Entity('provincia')
@Index(['nombre'], { unique: true })
export class Provincia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    nombre: string;

    @OneToMany(() => Municipio, municipio => municipio.provincia, { cascade: true })
    municipios: Municipio[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}
