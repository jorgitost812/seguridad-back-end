import { Municipio } from 'src/municipios/entities/municipio.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Computadora } from 'src/pcs/entities/pc.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity('jclub')
@Index(['nombre'])
@Index(['municipio_id'])
export class Jclub {

    @PrimaryGeneratedColumn()
    id: number;

<<<<<<< HEAD
@Column()
nombre: string;
=======
    @Column({ type: 'varchar', length: 100 })
    nombre: string;
>>>>>>> master

    @ManyToOne(() => Municipio, municipio => municipio.jclubs, { nullable: false })
    @JoinColumn({ name: 'municipio_id' })
    municipio: Municipio;

    @OneToMany(() => Computadora, computadora => computadora.jc, { cascade: true })
    computadoras: Computadora[];

    @OneToMany(() => Usuario, usuario => usuario.jc)
    usuarios: Usuario[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
}
