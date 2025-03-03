import { Test, TestingModule } from '@nestjs/testing';
import { FilmCommand } from './film.command';
import { CommandModule, CommandModuleTest } from 'nestjs-command';
import { FilmService } from './film.service';

describe('FilmCommand', () => {
  let filmCommand: FilmCommand;
  let commandModule: CommandModuleTest;
  const filmService = {
    syncFilmsFromApi: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilmCommand, FilmService],
      imports: [CommandModule],
    })
      .overrideProvider(FilmService)
      .useValue(filmService)
      .compile();

    filmCommand = module.get<FilmCommand>(FilmCommand);

    const app = module.createNestApplication();
    await app.init();

    commandModule = new CommandModuleTest(app.select(CommandModule));
  });

  it('should be defined', () => {
    expect(filmCommand).toBeDefined();
  });

  it('should import films from the Star Wars API', async () => {
    jest.spyOn(console, 'log');
    await commandModule.execute('sync:get-films-from-swapi', {});
    expect(filmService.syncFilmsFromApi).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});
