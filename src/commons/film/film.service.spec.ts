import { FilmService } from './film.service';
import { FilmModule } from './film.module';
import { BaseTestingModule } from '../../test/testing.module';
import { SwapiService } from './services/swapi.service';
import {
  mockArrayFilms,
  mockArrayFilmsTitles,
  mockFilm,
} from '../../fixtures/swapi.fixture';

describe('FilmService', () => {
  let testingModule: BaseTestingModule;
  let service: FilmService;
  let swapiService: SwapiService;
  beforeEach(async () => {
    testingModule = new BaseTestingModule();
    await testingModule.createTestingModule({
      imports: [FilmModule],
    });

    service = testingModule.testModule.get<FilmService>(FilmService);
    swapiService = testingModule.testModule.get<SwapiService>(SwapiService);
  });
  afterAll(async () => {
    await testingModule.closeTestingModule();
  });

  afterEach(async () => {
    await testingModule.dropDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(swapiService).toBeDefined();
  });

  describe('syncFilmsFromApi', () => {
    it('should sync films from SWAPI', async () => {
      jest.spyOn(swapiService, 'fetchFilms').mockResolvedValue(mockArrayFilms);
      const films = await service.syncFilmsFromApi();
      expect(films).toBeDefined();
      expect(films.length).toEqual(mockArrayFilms.length);
      expect(films).toEqual(mockArrayFilms);
    });

    it('should sync films from SWAPI and update existing films', async () => {
      await service.create(mockFilm);
      const existingFilm = await service.findAllWithDetails();
      expect(existingFilm.length).toEqual(1);

      jest.spyOn(swapiService, 'fetchFilms').mockResolvedValue(mockArrayFilms);
      await service.syncFilmsFromApi();
      const films = await service.findAllWithDetails();
      expect(existingFilm[0].opening_crawl).toEqual(mockFilm.opening_crawl);
      expect(films[0].opening_crawl).toEqual(mockArrayFilms[0].opening_crawl);
      expect(films.length).toEqual(mockArrayFilms.length);
    });

    it('should fail because the swapi service failed', async () => {
      jest
        .spyOn(swapiService, 'fetchFilms')
        .mockRejectedValue(new Error('Films not found'));
      await expect(service.syncFilmsFromApi()).rejects.toThrow(
        'Films not found',
      );
    });
  });

  describe('removeAll', () => {
    it('should remove all films', async () => {
      jest.spyOn(swapiService, 'fetchFilms').mockResolvedValue(mockArrayFilms);
      await service.syncFilmsFromApi();
      const oldFilms = await service.findAllWithDetails();
      expect(oldFilms.length).toEqual(mockArrayFilms.length);

      await service.removeAll();
      const films = await service.findAllWithDetails();
      expect(films.length).toEqual(0);
    });
  });

  describe('findAllTitles', () => {
    it('should find all films titles', async () => {
      jest.spyOn(swapiService, 'fetchFilms').mockResolvedValue(mockArrayFilms);
      await service.syncFilmsFromApi();
      const films = await service.findAllTitles();
      expect(films.length).toEqual(mockArrayFilmsTitles.length);
      expect(films.map((f) => f.title).sort()).toEqual(
        mockArrayFilmsTitles.map((f) => f.title).sort(),
      );
    });
  });

  describe('findAll', () => {
    it('should find all films', async () => {
      jest.spyOn(swapiService, 'fetchFilms').mockResolvedValue(mockArrayFilms);
      await service.syncFilmsFromApi();
      const films = await service.findAllWithDetails();
      expect(films.length).toEqual(mockArrayFilms.length);
    });
  });

  describe('create', () => {
    it('should create film', async () => {
      const film = await service.create(mockFilm);
      expect(film).toEqual(mockFilm);
    });
  });
  describe('updateOne', () => {
    it('should update film', async () => {
      const film = await service.create(mockFilm);
      const updatedFilm = await service.updateOne(film.id as number, {
        opening_crawl: 'It is a different opening crawl',
      });
      expect(updatedFilm.opening_crawl).toEqual(
        'It is a different opening crawl',
      );
    });
  });
  describe('removeOne', () => {
    it('should remove film', async () => {
      const film = await service.create(mockFilm);
      await service.removeOne(film.id as number);
      const films = await service.findAllWithDetails();
      expect(films.length).toEqual(0);
    });
  });
  describe('findOneById', () => {
    it('should find one film by id', async () => {
      const film = await service.create(mockFilm);
      const foundFilm = await service.findOneById(film.id as number);
      expect(foundFilm?.id).toEqual(film.id);
    });
  });
  describe('findOneByTitle', () => {
    it('should find one film by title', async () => {
      const film = await service.create(mockFilm);
      const foundFilm = await service.findOneByTitle(film.title as string);
      expect(foundFilm?.id).toEqual(film.id);
    });
  });
});
