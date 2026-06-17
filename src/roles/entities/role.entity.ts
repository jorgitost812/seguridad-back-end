import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('rol')
@Index(['nombre'], { unique: true })
export class Rol {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    nombre: string;

    @Column({ default: '', type: 'text' })
    descripcion: string;

    @OneToMany(() => Usuario, usuario => usuario.rol)
    usuarios: Usuario[];
}
