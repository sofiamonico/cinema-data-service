import { Role } from './role.entity';
import { RoleType } from '../../constants/role.constants';
import { validate } from 'class-validator';
import { BaseTestingModule } from '../../test/testing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';

describe('Role entity validation', () => {
  let testingModule: BaseTestingModule;

  beforeAll(async () => {
    testingModule = new BaseTestingModule();
    await testingModule.createTestingModule({
      imports: [TypeOrmModule.forFeature([Role])],
      providers: [RoleService],
    });
  });

  afterAll(async () => {
    await testingModule.closeTestingModule();
  });

  it('should be defined', () => {
    expect(new Role()).toBeDefined();
  });

  it.each(Object.values(RoleType))(
    'should accept valid role: %s',
    async (roleType) => {
      const role = new Role();
      role.slug = roleType;

      const errors = await validate(role);
      expect(errors.length).toBe(0);
    },
  );

  it('should reject invalid role', async () => {
    const role = new Role();
    (role as any).slug = 'invalidRole';

    const errors = await validate(role);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });

  it('should not accept null as role', async () => {
    const role = new Role();
    (role as any).slug = null;

    const errors = await validate(role);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
