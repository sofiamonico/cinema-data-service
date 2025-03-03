import { BaseTestingModule } from '../../test/testing.module';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RoleType } from '../../constants/role.constants';

describe('UserService', () => {
  let testingModule: BaseTestingModule;
  let service: UserService;
  let roleService: RoleService;

  beforeEach(async () => {
    testingModule = new BaseTestingModule();
    await testingModule.createTestingModule({
      imports: [UserModule, RoleModule],
    });

    service = testingModule.testModule.get<UserService>(UserService);
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
    expect(roleService).toBeDefined();
  });
  describe('create', () => {
    it('should create a user with correct data', async () => {
      const user = await service.create(
        {
          email: 'test@test.com',
          password: 'Secreta1234!',
        },
        RoleType.USER,
      );

      expect(user).toBe(true);

      const userCreated = await service.findByEmail('test@test.com');
      expect(userCreated).toBeDefined();
      expect(userCreated?.email).toBe('test@test.com');
      expect(userCreated?.password).not.toBe('Secreta1234!');
    });

    it('should failed because the user already exists', async () => {
      await service.create(
        {
          email: 'test@test.com',
          password: 'Secreta1234!',
        },
        RoleType.USER,
      );
      await expect(
        service.create(
          {
            email: 'test@test.com',
            password: 'Secreta1234!',
          },
          RoleType.USER,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should find a user by email', async () => {
      await service.create(
        {
          email: 'test@test.com',
          password: 'Secreta1234!',
        },
        RoleType.USER,
      );

      const user = await service.findByEmail('test@test.com');
      expect(user).toBeDefined();
      expect(user?.email).toBe('test@test.com');
    });
  });
  describe('findByEmail', () => {
    it('should not find a user by email', async () => {
      const user = await service.findByEmail('test@test.com');
      expect(user).toBeNull();
    });
  });

  describe('updateRolesByEmail', () => {
    it('should update a user role', async () => {
      await service.create(
        {
          email: 'test@test.com',
          password: 'Secreta1234!',
        },
        RoleType.USER,
      );

      const updatedUser = await service.updateRoleByEmail(
        'test@test.com',
        RoleType.ADMIN,
      );

      expect(updatedUser).toBeDefined();
      expect(updatedUser.email).toBe('test@test.com');
      expect(updatedUser.roles).toHaveLength(2);
      expect(updatedUser.roles[0].slug).toBe('user');
      expect(updatedUser.roles[1].slug).toBe('admin');
    });

    it('should failed because the user does not exist', async () => {
      await expect(
        service.updateRoleByEmail('test@test.com', RoleType.ADMIN),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('delete', () => {
    it('should delete a user', async () => {
      await service.create(
        {
          email: 'test@test.com',
          password: 'Secreta1234!',
        },
        RoleType.USER,
      );
      const user = await service.findByEmail('test@test.com');

      await service.remove(user?.id as number);

      const deletedUser = await service.findByEmail('test@test.com');
      expect(deletedUser).toBeNull();
    });
  });
  describe('deleteUserRoleByEmail', () => {
    it('should delete a user role', async () => {
      await service.create(
        {
          email: 'test@test.com',
          password: 'Secreta1234!',
        },
        RoleType.USER,
      );

      const user = await service.findByEmail('test@test.com');

      await service.updateRoleByEmail(user?.email as string, RoleType.ADMIN);

      await service.deleteUserRoleByEmail(
        user?.email as string,
        RoleType.ADMIN,
      );

      const updatedUser = await service.findByEmail(user?.email as string);
      expect(updatedUser?.roles).toHaveLength(1);
      expect(updatedUser?.roles[0].slug).toBe('user');
    });

    it('should failed because the user does not have the role', async () => {
      await expect(
        service.deleteUserRoleByEmail('test@test.com', RoleType.ADMIN),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
