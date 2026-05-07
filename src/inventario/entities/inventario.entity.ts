import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Jclub } from '../../jcs/entities/jc.entity';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 20, default: 'Bueno' })
  estado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio: number;

  @ManyToOne(() => Jclub, { eager: true })
  @JoinColumn({ name: 'jc_id' })
  ubicacion: Jclub;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}