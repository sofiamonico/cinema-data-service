import { SwapiService } from './swapi.service';
import { BaseTestingModule } from '../../../test/testing.module';
import { FilmModule } from '../film.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { mockFilmResponse } from '../../../fixtures/swapi.fixture';

describe('SwapiService', () => {
  let testingModule: BaseTestingModule;
  let service: SwapiService;
  let httpService: HttpService;

  beforeEach(async () => {
    testingModule = new BaseTestingModule();
    await testingModule.createTestingModule({
      imports: [FilmModule, HttpModule],
    });

    service = testingModule.testModule.get<SwapiService>(SwapiService);
    httpService = testingModule.testModule.get<HttpService>(HttpService);
  });

  afterAll(async () => {
    await testingModule.closeTestingModule();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });

  it('should fetch films from SWAPI', async () => {
    //create a mock for the httpService with the observable mock response
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockFilmResponse));
    const films = await service.fetchFilms();
    expect(films).toEqual(mockFilmResponse.data.results);
  });

  it('should handle error when fetching films from SWAPI', async () => {
    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(throwError(() => new Error()));
    await expect(service.fetchFilms()).rejects.toThrow(
      'Failed to fetch films from SWAPI',
    );
  });
});
