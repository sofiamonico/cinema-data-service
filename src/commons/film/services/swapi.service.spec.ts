import { SwapiService } from './swapi.service';
import { BaseTestingModule } from '../../../test/testing.module';
import { FilmModule } from '../film.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('SwapiService', () => {
  let testingModule: BaseTestingModule;
  let service: SwapiService;
  let httpService: HttpService;

  const mockFilmResponse: AxiosResponse = {
    data: {
      results: [
        {
          title: 'A New Hope',
          episode_id: 4,
          opening_crawl: 'It is a period of civil war...',
          director: 'George Lucas',
          producer: 'Gary Kurtz',
          release_date: '1977-05-25',
          characters: ['https://swapi.dev/api/people/1/'],
          planets: ['https://swapi.dev/api/planets/1/'],
          starships: ['https://swapi.dev/api/starships/1/'],
          vehicles: ['https://swapi.dev/api/vehicles/1/'],
          species: ['https://swapi.dev/api/species/1/'],
          url: 'https://swapi.dev/api/films/1/',
          created: '2014-12-10T14:23:31.880000Z',
          edited: '2014-12-20T19:49:45.256000Z',
        },
      ],
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} } as any,
  };

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
