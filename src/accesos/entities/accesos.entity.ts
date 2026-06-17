import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, JoinColumn } from 'typeorm';
import { Computadora } from '../../pcs/entities/pc.entity';

@Entity('c_accesos')
@Index(['computadora_id'])
@Index(['createdAt'])
@Index(['admin'])
export class Acceso {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombrejc: string;

    @Column({ type: 'varchar', length: 100 })
    nombrepc: string;

    @Column({ type: 'varchar', length: 100 })
    tecnico: string;

    @Column({ type: 'varchar', length: 100 })
    supervisor: string;

    @Column({ type: 'text' })
    causa: string;

    @Column({ type: 'varchar', length: 100 })
    inventario: string;

    @Column({ nullable: true })
    computadora_id: number;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    @Column({ default: false })
    admin: boolean;

    @ManyToOne(() => Computadora, pc => pc.accesos, { nullable: false })
    @JoinColumn({ name: 'computadora_id' })
    pc: Computadora;
}
