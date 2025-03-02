import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { RoleType } from '../constants/role.constants';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../dto/user/user-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: boolean; errors: string[] }> {
    const result = await this.userService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: result,
      errors: [],
    };
  }

  @Patch('/update-role/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  async updateRoleByEmail(
    @Param('email') email: string,
    @Body('roleSlug') roleSlug: RoleType,
  ): Promise<{ message: string; data: UserResponseDto; errors: string[] }> {
    const user = await this.userService.updateRoleByEmail(email, roleSlug);
    const response = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'User roles updated successfully',
      data: response,
      errors: [],
    };
  }

  @Delete('/delete-role/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  async deleteUserRoleByEmail(
    @Param('email') email: string,
    @Body('roleSlug') roleSlug: RoleType,
  ): Promise<{ message: string; data: UserResponseDto; errors: string[] }> {
    const user = await this.userService.deleteUserRoleByEmail(email, roleSlug);
    const response = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'User role deleted successfully',
      data: response,
      errors: [],
    };
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  async deleteUser(
    @Param('id') id: number,
  ): Promise<{ message: string; data: boolean; errors: string[] }> {
    const result = await this.userService.remove(id);
    return {
      message: 'User deleted successfully',
      data: result,
      errors: [],
    };
  }
}
