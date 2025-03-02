import { AxiosResponse } from 'axios';
import { Film } from '../commons/film/film.entity';

export const mockFilmResponse: AxiosResponse = {
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

export const mockArrayFilms: Film[] = [
  {
    title: 'A New Hope',
    episode_id: 4,
    opening_crawl: 'It a different opening crawl',
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
  {
    title: 'The Empire Strikes Back',
    episode_id: 5,
    opening_crawl: 'It is a dark time for the Rebellion...',
    director: 'Irvin Kershner',
    producer: 'Gary Kurtz',
    release_date: '1980-05-17',
    url: 'https://swapi.dev/api/films/1/',
    created: '2014-12-10T14:23:31.880000Z',
    edited: '2014-12-20T19:49:45.256000Z',
    characters: ['https://swapi.dev/api/people/1/'],
  },
  {
    title: 'Return of the Jedi',
    episode_id: 6,
    opening_crawl: 'Luke Skywalker has returned to his home planet...',
    director: 'Richard Marquand',
    producer: 'Howard G. Kazanjian',
    release_date: '1983-05-25',
    characters: ['https://swapi.dev/api/people/1/'],
    planets: ['https://swapi.dev/api/planets/1/'],
    starships: ['https://swapi.dev/api/starships/1/'],
    vehicles: ['https://swapi.dev/api/vehicles/1/'],
    species: ['https://swapi.dev/api/species/1/'],
    url: 'https://swapi.dev/api/films/1/',
    created: '2014-12-10T14:23:31.880000Z',
    edited: '2014-12-20T19:49:45.256000Z',
  },
];

export const mockFilm: Film = {
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
};

export const mockArrayFilmsTitles: Partial<Film>[] = [
  { title: 'A New Hope' },
  { title: 'The Empire Strikes Back' },
  { title: 'Return of the Jedi' },
];
