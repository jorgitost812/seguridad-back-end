import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('c_accesos')
export class cAccesos {
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
}