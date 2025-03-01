import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Film } from '../film.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SwapiService {
  private readonly baseUrl = 'https://swapi.dev/api/';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Fetch all films from SWAPI
   * @returns Array of films from the API
   */
  async fetchFilms(): Promise<Film[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}films`),
      );
      return data.results.map((film: any) => {
        const newFilm = new Film();
        newFilm.title = film.title;
        newFilm.episode_id = film.episode_id;
        newFilm.opening_crawl = film.opening_crawl;
        newFilm.director = film.director;
        newFilm.producer = film.producer;
        newFilm.release_date = film.release_date;
        newFilm.characters = film.characters;
        newFilm.planets = film.planets;
        newFilm.starships = film.starships;
        newFilm.vehicles = film.vehicles;
        newFilm.species = film.species;
        newFilm.url = film.url;
        newFilm.created = film.created;
        newFilm.edited = film.edited;
        return newFilm;
      });
    } catch (error) {
      console.error('Error fetching films from SWAPI:', error);
      throw new Error('Failed to fetch films from SWAPI');
    }
  }
}
