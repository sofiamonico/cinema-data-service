import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { BaseTestingModule } from '../../test/testing.module';
import { UserService } from '../user/user.service';
import { RoleType } from '../../constants/role.constants';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';

describe('AuthService', () => {
  let testingModule: BaseTestingModule;
  let service: AuthService;
  let userService: UserService;
  let roleService: RoleService;

  beforeEach(async () => {
    testingModule = new BaseTestingModule();
    await testingModule.createTestingModule({
      imports: [AuthModule, RoleModule],
    });

    service = testingModule.testModule.get<AuthService>(AuthService);
    userService = testingModule.testModule.get<UserService>(UserService);
    roleService = testingModule.testModule.get<RoleService>(RoleService);
    await roleService.initializeRoles();
  });
  afterAll(async () => {
    await testingModule.closeTestingModule();
  });

  afterEach(async () => {
    await testingModule.dropDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });
  describe('validateUser', () => {
    it('should validate user', async () => {
      await userService.create(
        {
          email: 'test@test.com',
          password: 'password',
        },
        RoleType.USER,
      );
      const user = await userService.findByEmail('test@test.com');
      const result = await service.validateUser(
        user?.email as string,
        'password',
      );
      expect(result).toEqual(user);
    });
    it('should not validate user', async () => {
      const result = await service.validateUser(
        'test@test.com',
        'wrongpassword',
      );
      expect(result).toEqual(null);
    });
  });
  describe('login', () => {
    it('should login', async () => {
      await userService.create(
        {
          email: 'test@test.com',
          password: 'password',
        },
        RoleType.USER,
      );
      const result = await service.login('test@test.com', 'password');
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
    });
    it('should not login', async () => {
      await expect(
        service.login('test@test.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
