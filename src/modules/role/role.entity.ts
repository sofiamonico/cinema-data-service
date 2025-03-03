import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleType } from '../../constants/role.constants';

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
  slug: RoleType;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: Date;
}
