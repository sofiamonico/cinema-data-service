import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Film } from './film.entity';
import { FilmService } from './film.service';
import { SwapiService } from './services/swapi.service';
import { GuardsModule } from '../auth/guards/guards.module';
import { FilmController } from './film.controller';
import { FilmCommand } from './film.command';

@Module({
  imports: [TypeOrmModule.forFeature([Film]), HttpModule, GuardsModule],
  controllers: [FilmController],
  providers: [FilmService, SwapiService, FilmCommand],
  exports: [FilmService, SwapiService],
})
export class FilmModule {}
