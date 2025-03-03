import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FilmDto } from '../../../dto/film/film.dto';

@Injectable()
export class SwapiService {
  private readonly baseUrl = 'https://swapi.dev/api/';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Fetch all films from SWAPI
   * @returns {Promise<Film[]>} Array of films from the API
   */
  async fetchFilms(): Promise<FilmDto[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}films`),
      );
      return data.results.map((film: any) => {
        const filmDto = new FilmDto();
        Object.assign(filmDto, {
          title: film.title,
          episode_id: film.episode_id,
          opening_crawl: film.opening_crawl,
          director: film.director,
          producer: film.producer,
          release_date: film.release_date,
          characters: film.characters,
          planets: film.planets,
          starships: film.starships,
          vehicles: film.vehicles,
          species: film.species,
          url: film.url,
        });
        return filmDto;
      });
    } catch (error) {
      console.error('Error fetching films from SWAPI:', error);
      throw new Error('Failed to fetch films from SWAPI');
    }
  }
}
