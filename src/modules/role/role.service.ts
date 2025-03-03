import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleType } from '../../constants/role.constants';
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Create a new role
   * @param slug - The slug of the role
   * @returns {Promise<Role>} The created role
   */
  async create(slug: RoleType): Promise<Role> {
    return this.roleRepository.save({ slug });
  }

  /**
   * Get all roles
   * @returns {Promise<Role[]>} An array of roles
   */
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  /**
   * Get a role by its slug
   * @param slug - The slug of the role
   * @returns {Promise<Role>} The role
   */
  async findBySlug(slug: RoleType): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { slug } });
    if (!role) {
      throw new NotFoundException(`Role with slug ${slug} not found`);
    }
    return role;
  }

  /**
   * Remove all roles
   */
  async removeAll(): Promise<void> {
    await this.roleRepository.delete({});
  }

  /**
   * Initialize roles
   */
  async initializeRoles(): Promise<void> {
    for (const roleType of Object.values(RoleType)) {
      const existingRole = await this.roleRepository.findOne({
        where: { slug: roleType },
      });
      if (!existingRole) {
        await this.create(roleType);
      }
    }
  }
}
