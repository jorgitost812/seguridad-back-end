import { Acceso } from 'src/accesos/entities/accesos.entity';
import { Jclub } from 'src/jcs/entities/jc.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('computadora')
@Index(['jc_id'])
@Index(['nombre'])
@Index(['ip'], { unique: true })
export class Computadora {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 50 })
    numero: string;

    @Column({ type: 'varchar', length: 15, unique: true })
    ip: string;

    @Column('json', { nullable: true })
    pwd: object;

    @Column('json', { nullable: true })
    setupPwd: object;

    @ManyToOne(() => Jclub, jc => jc.computadoras, { nullable: false })
    @JoinColumn({ name: 'jc_id' })
    jc: Jclub;

    @OneToMany(() => Acceso, acceso => acceso.pc, {
        onDelete: 'CASCADE',
        cascade: true
    })
    accesos: Acceso[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}
