import { Expose, Exclude } from 'class-transformer';

export class UserProfileDto {
  @Expose()
  id: number;

  @Expose()
  nombre: string;

  @Expose()
  apellidos: string;

  @Expose()
  email: string;

  @Expose()
  grupo_municipal: boolean;

  @Expose()
  activo: boolean;

  @Exclude()
  password: string;
}