import { RoleService } from './role.service';
import { RoleModule } from './role.module';
import { BaseTestingModule } from '../../test/testing.module';
import { RoleType } from '../../constants/role.constants';

describe('RoleService', () => {
  let testingModule: BaseTestingModule;
  let service: RoleService;

  beforeEach(async () => {
    testingModule = new BaseTestingModule();
    await testingModule.createTestingModule({
      imports: [RoleModule],
    });

    service = testingModule.testModule.get<RoleService>(RoleService);
  });
  afterAll(async () => {
    await testingModule.closeTestingModule();
  });

  afterEach(async () => {
    await testingModule.dropDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create all the permited roles', async () => {
    await service.initializeRoles();
    const roles = await service.findAll();

    expect(roles).toBeDefined();
    expect(roles.length).toBe(3);
    expect(roles.map((role) => role.slug)).toEqual([
      RoleType.ADMIN,
      RoleType.USER,
      RoleType.SUPER_ADMIN,
    ]);
  });

  it('should find a role by name', async () => {
    await service.initializeRoles();
    const role = await service.findBySlug(RoleType.ADMIN);
    expect(role).toBeDefined();
    expect(role.slug).toBe(RoleType.ADMIN);
  });

  it('should delete all the roles', async () => {
    await service.initializeRoles();
    await service.removeAll();
    const roles = await service.findAll();
    expect(roles).toBeDefined();
    expect(roles.length).toBe(0);
  });
});
