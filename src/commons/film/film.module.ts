import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './film.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Film])],
  controllers: [],
  providers: [],
})
export class FilmModule {}
