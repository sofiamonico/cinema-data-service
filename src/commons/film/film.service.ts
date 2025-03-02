import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
   * @returns {Promise<Film[]>} The created films
   */
  async bulkCreate(films: Film[]): Promise<Film[]> {
    return this.filmRepository.save(films);
  }

  /**
   * Create a film
   * @param film - The film to create
   * @returns {Promise<Film>} The created film
   */
  async create(film: Film): Promise<Film> {
    return this.filmRepository.save(film);
  }

  /**
   * Find one film by title
   * @param title - The title of the film
   * @returns {Promise<Film | null>} The film
   */
  async findOneByTitle(title: string): Promise<Film | null> {
    return this.filmRepository.findOne({ where: { title } });
  }

  /**
   * Find one film by id
   * @param id - The id of the film
   * @returns {Promise<Film | null>} The film
   */
  async findOneById(id: number): Promise<Film | null> {
    return this.filmRepository.findOne({ where: { id } });
  }

  /**
   * Find all films
   * @returns {Promise<Film[]>} Array of films
   */
  async findAllWithDetails(): Promise<Film[]> {
    return this.filmRepository.find();
  }

  /**
   * Find all films titles
   * @returns {Promise<Partial<Film>[]>} Array of films titles
   */
  async findAllTitles(): Promise<Partial<Film>[]> {
    return this.filmRepository.find({ select: ['title'] });
  }

  /**
   * Sync films from SWAPI
   * @returns {Promise<Film[]>} The synced films
   */
  async syncFilmsFromApi(): Promise<Film[]> {
    const apiFilms = await this.swapiService.fetchFilms();
    const existingFilms = await this.findAllWithDetails();

    const syncedFilms = await Promise.all(
      apiFilms.map(async (apiFilm) => {
        const existingFilm = existingFilms.find(
          (f) => f.title === apiFilm.title,
        );
        if (existingFilm && existingFilm.id) {
          return this.updateOne(existingFilm.id, apiFilm);
        }
        return this.create(apiFilm);
      }),
    );

    return syncedFilms;
  }

  /**
   * Remove all films
   * @returns {Promise<void>} The removed films
   */
  async removeAll(): Promise<void> {
    await this.filmRepository.delete({});
  }

  /**
   * Remove one film
   * @param id - The id of the film
   * @returns {Promise<void>} The removed film
   */
  async removeOne(id: number): Promise<void> {
    await this.filmRepository.delete(id);
  }

  /**
   * Update one film
   * @param id - The id of the film
   * @param film - The film to update
   * @returns {Promise<Film>} The updated film
   */
  async updateOne(id: number, film: Partial<Film>): Promise<Film> {
    const existingFilm = await this.filmRepository.findOne({ where: { id } });
    if (!existingFilm) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    return this.filmRepository.save({ ...existingFilm, ...film });
  }
}
