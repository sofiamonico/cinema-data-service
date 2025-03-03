import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'ID User',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({
    description: 'User email',
    example: 'usuario@ejemplo.com',
    uniqueItems: true,
  })
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: '$2a$10$JwbmU1Y1cVSGv.7YE9UoM.1kRf2r7W4vx9YDv1Jz/nxcJ4iCZJOu2',
    minLength: 8,
    maxLength: 60,
  })
  @Column()
  @MinLength(8)
  @MaxLength(60) // bcrypt genera un hash de 60 caracteres
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User roles',
    type: [Role],
  })
  @ManyToMany(() => Role, { eager: true })
  @JoinTable({
    name: 'users_roles_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @ApiProperty({
    description: 'User created at',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @ApiProperty({
    description: 'User updated at',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt?: Date;
}
