import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class funcionesRol{

@PrimaryGeneratedColumn()
id: number;

@Column()
nombre: string;

}