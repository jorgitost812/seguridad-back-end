import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, Unique, Index, JoinColumn } from 'typeorm';
import { Length, IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude, plainToClass } from 'class-transformer';
import { Rol } from '../../roles/entities/role.entity';
import { Jclub } from '../../jcs/entities/jc.entity';

@Entity('usuario')
@Unique(['email'])
@Index(['email'])
@Index(['rol_id'])
@Index(['jc_id'])
@Index(['activo'])
@Index(['createdAt'])
export class Usuario extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

@Column({ type: 'varchar', length: 20 })
@IsNotEmpty({ message: 'El nombre es requerido' })
nombre: string;

@Column({ type: 'varchar', length: 30 })
@IsNotEmpty({ message: 'Los apellidos son requeridos' })
apellidos: string;

<<<<<<< HEAD
@Column({ unique: true })
@IsEmail({}, { message: 'Email inválido' })
@IsNotEmpty({ message: 'El email es requerido' })
email: string;
=======
    @Column({ unique: true, type: 'varchar' })
    @IsEmail({}, { message: 'Email inválido' })
    @IsNotEmpty({ message: 'El email es requerido' })
    email: string;
>>>>>>> master

@Column()
@IsNotEmpty({ message: 'La contraseña es requerida' })
@Length(6, 100, { message: 'La contraseña debe tener entre 6 y 100 caracteres' })
@Exclude({ toPlainOnly: true })
password: string;

    @ManyToOne(() => Rol, rol => rol.usuarios, { nullable: false })
    @JoinColumn({ name: 'rol_id' })
    rol: Rol;

    @ManyToOne(() => Jclub, jc => jc.usuarios, { nullable: true })
    @JoinColumn({ name: 'jc_id' })
    jc: Jclub;

    @Column({ default: false })
    grupo_municipal: boolean;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

    toString(): string {
        return this.email;
    }

    toJSON(): Record<string, any> {
        return plainToClass(Usuario, this, { excludeExtraneousValues: true });
    }

    async checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): Promise<boolean> {
        const bcrypt = await import('bcrypt');
        return bcrypt.compare(unencryptedPassword, this.password);
    }
}
