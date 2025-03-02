import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Film } from './film.entity';
import { FilmService } from './film.service';
import { SwapiService } from './services/swapi.service';
import { GuardsModule } from '../auth/guards/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Film]), HttpModule, GuardsModule],
  controllers: [],
  providers: [FilmService, SwapiService],
  exports: [FilmService, SwapiService],
})
export class FilmModule {}
