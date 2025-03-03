import { Injectable } from '@nestjs/common';
import { Command, Option } from 'nestjs-command';
import { UserService } from './user.service';
import { RoleType } from '../../constants/role.constants';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '../../dto/user/create-user.dto';

@Injectable()
export class UserCommand {
  constructor(private readonly userService: UserService) {}

  @Command({
    command: 'create:user-super-admin',
    describe: 'Create a user super admin',
  })
  async createUserSuperAdmin(
    @Option({
      name: 'email',
      describe: 'User email',
      type: 'string',
      required: true,
    })
    email: string,
    @Option({
      name: 'password',
      describe: 'User password',
      type: 'string',
      required: true,
    })
    password: string,
  ) {
    console.log('Creating user super admin');
    await this.userService.create(
      plainToClass(CreateUserDto, {
        email,
        password,
      }),
      RoleType.SUPER_ADMIN,
    );
    console.log('User super admin created successfully');
  }
}
