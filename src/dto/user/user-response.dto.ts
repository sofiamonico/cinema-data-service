import { Expose } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../../modules/role/role.entity';

export class UserResponseDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsArray()
  @IsNotEmpty()
  roles: Role[];
}
