import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum RoleType {
  ADMIN = 'admin',
  USER = 'user',
  SUPERADMIN = 'superadmin',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    unique: true,
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  @IsNotEmpty()
  @IsEnum(RoleType)
  name: RoleType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: Date;
}
