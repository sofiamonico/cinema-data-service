import { Test, TestingModule } from '@nestjs/testing';
import { UserCommand } from './user.command';
import { CommandModule, CommandModuleTest } from 'nestjs-command';
import { UserService } from './user.service';
import { RoleType } from '../../constants/role.constants';

describe('UserCommand', () => {
  let userCommand: UserCommand;
  let commandModule: CommandModuleTest;
  const userService = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCommand, UserService],
      imports: [CommandModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    userCommand = module.get<UserCommand>(UserCommand);

    const app = module.createNestApplication();
    await app.init();

    commandModule = new CommandModuleTest(app.select(CommandModule));
  });

  it('should be defined', () => {
    expect(userCommand).toBeDefined();
  });

  it('should create a super admin user', async () => {
    jest.spyOn(console, 'log');
    await commandModule.execute('create:user-super-admin', {
      email: 'superadmin@example.com',
      password: 'PasswordSeguro123',
    });
    expect(userService.create).toHaveBeenCalled();
    expect(userService.create).toHaveBeenCalledWith(
      {
        email: 'superadmin@example.com',
        password: 'PasswordSeguro123',
      },
      RoleType.SUPER_ADMIN,
    );
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});
