import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class cAccesos{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombrejc: string; 
  
  @Column()
  nombrepc: string; 

  @Column()
  inventario: string; 
  
  @Column()
  admin: string; 

  @Column()
  tecnico: string;
  
  @Column()
  supervisor: string;  
  
  @Column()
  causa: string; 

  @Column()
  @CreateDateColumn()
  createdAt: Date;

}