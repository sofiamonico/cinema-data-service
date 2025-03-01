import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Film } from './film.entity';
import { FilmService } from './film.service';
import { SwapiService } from './services/swapi.service';

@Module({
  imports: [TypeOrmModule.forFeature([Film]), HttpModule],
  controllers: [],
  providers: [FilmService, SwapiService],
  exports: [FilmService, SwapiService],
})
export class FilmModule {}
