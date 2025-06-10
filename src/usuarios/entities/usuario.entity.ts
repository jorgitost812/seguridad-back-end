import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, Unique, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Length, IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude, plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Rol } from '../../roles/entities/role.entity';
import { Jclub } from '../../jcs/entities/jc.entity';

@Entity('usuario')
@Unique(['email'])
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20 })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    nombre: string;

    @Column({ type: 'varchar', length: 30 })
    @IsNotEmpty({ message: 'Los apellidos son requeridos' })
    apellidos: string;

    @Column({ unique: true })
    @IsEmail({}, { message: 'Email inválido' })
    @IsNotEmpty({ message: 'El email es requerido' })
    email: string;

    @Column()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @Length(6, 100, { message: 'La contraseña debe tener entre 6 y 100 caracteres' })
    @Exclude({ toPlainOnly: true })
    password: string;

    @ManyToOne(() => Rol, rol => rol.id, { eager: true })
    rol: Rol;

    @ManyToOne(() => Jclub, jc => jc.id, { eager: true })
    jc: Jclub;

    @Column({ default: false })
    grupo_municipal: boolean;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
  async hashPasswordInsert(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

    @BeforeUpdate()
  async hashPasswordUpdate(): Promise<void> {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

    toString(): string {
        return this.email;
    }

    toJSON(): Record<string, any> {
        return plainToClass(Usuario, this, { excludeExtraneousValues: true });
    }

    async checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): Promise<boolean> {
        return bcrypt.compare(unencryptedPassword, this.password);
    }
}