import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Provincia } from '../../provincias/entities/provincia.entity';
import { Jclub } from '../../jcs/entities/jc.entity';

@Entity('municipio')
@Index(['nombre'])
@Index(['provincia_id'])
export class Municipio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @ManyToOne(() => Provincia, provincia => provincia.municipios, { nullable: false })
    @JoinColumn({ name: 'provincia_id' })
    provincia: Provincia;

    @OneToMany(() => Jclub, jclub => jclub.municipio)
    jclubs: Jclub[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}
