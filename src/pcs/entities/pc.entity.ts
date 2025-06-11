import { Acceso } from 'src/accesos/entities/accesos.entity';
import { Jclub } from 'src/jcs/entities/jc.entity';

import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany} from 'typeorm';

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

@ManyToOne(() => Jclub, jc => jc.computadoras) // Debe apuntar a la propiedad en Jclub
@JoinColumn({ name: 'jc_id' })
jc: Jclub;

@OneToMany(() => Acceso, acceso => acceso.pc)
    accesos: Acceso[];
}