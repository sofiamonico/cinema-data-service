import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { RoleType } from '../../constants/role.constants';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  /**
   * Create a new user
   * @param createUserDto - The user to create
   * @returns {Promise<User>} The created user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verify if the email already exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = new User();
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.roles = [await this.roleService.findBySlug(RoleType.USER)];
    return this.userRepository.save(user);
  }

  /**
   * Find a user by their email
   * @param email - The email of the user
   * @returns {Promise<User | null>} The user or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Find a user by their id
   * @param id - The id of the user
   * @returns {Promise<User | null>}  The user or null if not found
   */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Update a user's role
   * @param userId - The id of the user
   * @param roleIds - The ids of the roles
   * @returns {Promise<User>} The updated user
   */
  async updateRolesByEmail(email: string, roleSlug: RoleType): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleService.findBySlug(roleSlug);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    user.roles = [...user.roles, role];
    return this.userRepository.save(user);
  }

  /**
   * Remove a user
   * @param id - The id of the user
   * @returns {Promise<void>} The removed user
   */
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * Delete a user's role
   * @param email - The email of the user
   * @param roleSlug - The slug of the role
   * @returns {Promise<User>} The updated user
   */
  async deleteUserRoleByEmail(
    email: string,
    roleSlug: RoleType,
  ): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roles = user.roles.filter((role) => role.slug !== roleSlug);
    return this.userRepository.save(user);
  }
}
