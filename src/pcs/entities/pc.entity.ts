import { Jclub } from 'src/jcs/entities/jc.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Computadora{

@PrimaryGeneratedColumn()
id: number;

@Column()
nombre: string;

@Column()
numero: string;

@Column()
ip: string;

@Column('json', {nullable: true})
pwd: object;

@Column('json', {nullable: true})
setupPwd: object;

@ManyToOne(() => Jclub, jc => jc.id)
jc: Jclub;

}