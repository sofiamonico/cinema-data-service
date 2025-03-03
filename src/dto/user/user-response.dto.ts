import { Expose } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../../modules/role/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User email',
    example: 'usuario@ejemplo.com',
  })
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Roles assigned to the user',
    example: [{ id: 1, name: 'User', slug: 'user' }],
    type: [Role],
  })
  @Expose()
  @IsArray()
  @IsNotEmpty()
  roles: Role[];
}
