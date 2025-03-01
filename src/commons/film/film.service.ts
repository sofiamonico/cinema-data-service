import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Film } from './film.entity';
import { SwapiService } from './services/swapi.service';

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    private readonly swapiService: SwapiService,
  ) {}

  /**
   * Bulk create films
   * @param films - The films to create
   * @returns The created films
   */
  async bulkCreate(films: Film[]): Promise<Film[]> {
    return this.filmRepository.save(films);
  }

  /**
   * Find one film by title
   * @param title - The title of the film
   * @returns The film
   */
  async findOneByTitle(title: string): Promise<Film | null> {
    return this.filmRepository.findOne({ where: { title } });
  }

  /**
   * Find all films
   * @returns Array of films
   */
  async findAll(): Promise<Film[]> {
    return this.filmRepository.find();
  }

  /**
   * Sync films from SWAPI
   * @returns The synced films
   */
  async syncFilmsFromApi(): Promise<Film[]> {
    const films = await this.swapiService.fetchFilms();
    return this.bulkCreate(films);
  }
}
