import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, Unique } from 'typeorm';
import { Length, IsEmail } from 'class-validator';
import { Exclude, instanceToPlain } from "class-transformer";
import * as bcrypt from 'bcrypt';
import {Rol} from '../../roles/entities/role.entity';
import {Jclub} from '../../jcs/entities/jc.entity'


@Entity()
@Unique(['email'])
export class Usuario extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  nombre: string;

  @Column({ type: 'varchar', length: 30 })
  apellidos: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ManyToOne(() => Rol, rol => rol.id)
  rol: Rol;
  
 
  @ManyToOne(() => Jclub, jc => jc.id)
  jc: Jclub;

  @Column({ default: false })
  grupo_municipal: boolean;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  public toString(): string {
    return `${this.email}`;
  }

  toJSON() {
    return instanceToPlain(this);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }

}