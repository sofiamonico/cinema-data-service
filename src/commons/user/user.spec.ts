import { validate } from 'class-validator';
import { Role } from '../role/role.entity';
import { User } from './user.entity';
import { RoleType } from '../../constants/role.constants';

describe('User entity', () => {
  const role = new Role();
  role.slug = RoleType.ADMIN;
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });

  it('should have email, password, roles, createdAt, and updatedAt properties', async () => {
    const user = new User();
    user.email = 'test@test.com';
    user.password = '12345678';
    user.roles = [role];

    const errors = await validate(user);
    expect(errors.length).toBe(0);
  });

  it('should reject invalid email', async () => {
    const user = new User();
    user.email = 'invalidEmail';
    user.password = '12345678';
    user.roles = [role];

    const errors = await validate(user);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should reject invalid password', async () => {
    const user = new User();
    user.email = 'test@test.com';
    user.password = '1'.repeat(61);
    user.roles = [role];

    const errors = await validate(user);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });
});
