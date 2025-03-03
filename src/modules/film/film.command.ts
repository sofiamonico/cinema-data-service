import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { FilmService } from './film.service';

@Injectable()
export class FilmCommand {
  constructor(private readonly filmService: FilmService) {}

  @Command({
    command: 'sync:get-films-from-swapi',
    describe: 'Synchronize films from the Star Wars API',
  })
  async importFilms() {
    console.log('Synchronizing films from the Star Wars API');
    await this.filmService.syncFilmsFromApi();
    console.log('Films synchronized');
  }
}
