import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { BaseTestingModule } from '../test/testing.module';
import { UserService } from '../commons/user/user.service';

describe('AuthService', () => {
  let testingModule: BaseTestingModule;
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    testingModule = new BaseTestingModule();
    await testingModule.createTestingModule({
      imports: [AuthModule],
    });

    service = testingModule.testModule.get<AuthService>(AuthService);
    userService = testingModule.testModule.get<UserService>(UserService);
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
      const user = await userService.create({
        email: 'test@test.com',
        password: 'password',
      });
      const result = await service.validateUser('test@test.com', 'password');
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
      const user = await userService.create({
        email: 'test@test.com',
        password: 'password',
      });
      const result = await service.login(user.email, 'password');
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
