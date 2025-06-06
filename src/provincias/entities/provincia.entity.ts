import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Provincia{

@PrimaryGeneratedColumn()
id: number;

@Column({type:'varchar', length: 20})
nombre: string;

}