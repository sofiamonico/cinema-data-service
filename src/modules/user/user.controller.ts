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
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { RoleType } from '../../constants/role.constants';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../dto/user/user-response.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiExtraModels(UserResponseDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with basic role',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already registered',
  })
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: boolean; errors: string[] }> {
    const result = await this.userService.create(createUserDto, RoleType.USER);
    return {
      message: 'User created successfully',
      data: result,
      errors: [],
    };
  }

  @ApiOperation({
    summary: 'Update user role',
    description: 'Update the role of an existing user by email',
  })
  @ApiParam({
    name: 'email',
    description: 'User email',
    example: 'usuario@ejemplo.com',
  })
  @ApiBody({
    description: 'Role to assign',
    schema: {
      type: 'object',
      properties: {
        roleSlug: {
          type: 'string',
          enum: Object.values(RoleType),
          example: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Not enough permissions',
  })
  @ApiBearerAuth()
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

  @ApiOperation({
    summary: 'Delete user role',
    description: 'Delete a specific role from a user by email',
  })
  @ApiParam({
    name: 'email',
    description: 'User email',
    example: 'usuario@ejemplo.com',
  })
  @ApiBody({
    description: 'Role to delete',
    schema: {
      type: 'object',
      properties: {
        roleSlug: {
          type: 'string',
          enum: Object.values(RoleType),
          example: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role deleted successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Not enough permissions',
  })
  @ApiBearerAuth()
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

  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete a user by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to delete',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Not enough permissions',
  })
  @ApiBearerAuth()
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
