import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity()
export class iniSesion {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;
}