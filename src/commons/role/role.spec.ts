import { Role, RoleType } from './role.entity';
import { validate } from 'class-validator';

describe('Role entity validation', () => {
  it('should be defined', () => {
    expect(new Role()).toBeDefined();
  });

  it.each(Object.values(RoleType))(
    'should accept valid role: %s',
    async (roleType) => {
      const role = new Role();
      role.name = roleType;

      const errors = await validate(role);
      expect(errors.length).toBe(0);
    },
  );

  it('should reject invalid role', async () => {
    const role = new Role();
    (role as any).name = 'invalidRole';

    const errors = await validate(role);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should not accept null as role', async () => {
    const role = new Role();
    (role as any).name = null;

    const errors = await validate(role);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
