import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('trazas')
export class Traza {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
  fecha: Date;

  @Column({ name: 'usuario_email', length: 100 })
  usuarioEmail: string;

  @Column({ name: 'usuario_rol', length: 50 })
  usuarioRol: string;

  @Column({ name: 'accion', length: 20 })
  accion: string; // CREATE, UPDATE, DELETE, LOGIN, AUTORIZAR

  @Column({ name: 'entidad', length: 50 })
  entidad: string; // Usuario, Computadora, JovenClub, Municipio, Rol, Acceso

  @Column({ name: 'entidad_id', nullable: true })
  entidadId: number;

  @Column({ name: 'entidad_nombre', length: 200, nullable: true })
  entidadNombre: string;

  @Column({ name: 'jc_id', nullable: true })
  jcId: number;

  @Column({ name: 'detalles', type: 'json', nullable: true })
  detalles: any;
}
