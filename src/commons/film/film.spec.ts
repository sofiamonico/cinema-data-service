import { Film } from './film.entity';
import { validate } from 'class-validator';

describe('Film entity validation', () => {
  const dateExpected = new Date().toISOString();
  let validFilm: Film;

  beforeEach(() => {
    validFilm = {
      title: 'Test',
      episode_id: 1,
      opening_crawl: 'Test',
      director: 'Test',
      producer: 'Test',
      release_date: dateExpected,
      characters: ['1', '2', '3'],
      planets: ['1', '2', '3'],
      starships: ['1', '2', '3'],
      vehicles: ['1', '2', '3'],
      species: ['1', '2', '3'],
      url: 'https://swapi.dev/api/films/1/',
      created: dateExpected,
      edited: dateExpected,
    };
  });

  it('should be defined', () => {
    expect(new Film()).toBeDefined();
  });

  it('should be a valid film with all fields (required and optional)', async () => {
    delete (validFilm as any).planets;
    delete (validFilm as any).starships;
    delete (validFilm as any).vehicles;
    delete (validFilm as any).species;
    const film = new Film(validFilm);

    const errors = await validate(film);

    expect(errors.length).toBe(0);
    expect(film).toBeDefined();
    expect(film.planets).toBeUndefined();
    expect(film.starships).toBeUndefined();
    expect(film.vehicles).toBeUndefined();
    expect(film.species).toBeUndefined();
  });

  it('should be a valid film with only required fields', async () => {
    const film = new Film(validFilm);

    const errors = await validate(film);

    expect(errors.length).toBe(0);
    expect(film).toBeDefined();
    expect(film).toEqual(validFilm);
  });

  it.each(['title', 'episode_id', 'opening_crawl', 'director', 'producer'])(
    'should validate that %s is required',
    async (field) => {
      delete (validFilm as any)[field];
      const film = new Film(validFilm);
      const errors = await validate(film);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === field)).toBeTruthy();
      const fieldError = errors.find((error) => error.property === field);
      expect(fieldError?.constraints).toHaveProperty('isNotEmpty');
    },
  );

  it.each([
    ['title', 'string', 123],
    ['episode_id', 'number', 'not a number'],
    ['opening_crawl', 'string', 123],
    ['director', 'string', 123],
    ['producer', 'string', 123],
    ['release_date', 'date string', 'not a date'],
    ['characters', 'string array', 'not an array'],
    ['url', 'URL', 'not a url'],
    ['created', 'date string', 'not a date'],
    ['edited', 'date string', 'not a date'],
  ])(
    'should validate that %s is a valid %s',
    async (field, type, invalidValue) => {
      (validFilm as any)[field] = invalidValue;

      const film = new Film(validFilm);
      const errors = await validate(film);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === field)).toBeTruthy();
      const fieldError = errors.find((error) => error.property === field);

      // Verificar el tipo de error específico según el campo
      switch (type) {
        case 'string':
          expect(fieldError?.constraints).toHaveProperty('isString');
          break;
        case 'number':
          expect(fieldError?.constraints).toHaveProperty('isNumber');
          break;
        case 'date string':
          expect(fieldError?.constraints).toHaveProperty('isDateString');
          break;
        case 'string array':
          expect(fieldError?.constraints).toHaveProperty('isArray');
          break;
        case 'URL':
          expect(fieldError?.constraints).toHaveProperty('isUrl');
          break;
      }
    },
  );
});
