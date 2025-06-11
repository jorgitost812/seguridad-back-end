import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import {  Computadora } from '../../pcs/entities/pc.entity';

@Entity('c_accesos')
export class Acceso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombrejc: string;

  @Column()
  nombrepc: string;

  @Column()
  tecnico: string;

  @Column()
  supervisor: string;

  @Column()
  causa: string;

  @Column()
  inventario: string;

  @Column({ nullable: true })
  computadora_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  admin: boolean;

  @ManyToOne(() => Computadora, pc => pc.accesos)
  pc: Computadora;
}