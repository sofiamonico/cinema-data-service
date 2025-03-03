import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFilmDto {
  @ApiPropertyOptional({
    description: 'Título de la película',
    example: 'Star Wars: A New Hope',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Número de episodio de la película',
    example: 4,
  })
  @IsOptional()
  @IsNumber()
  episode_id?: number;

  @ApiPropertyOptional({
    description: 'Texto de apertura de la película',
    example: 'It is a period of civil war...',
  })
  @IsOptional()
  @IsString()
  opening_crawl?: string;

  @ApiPropertyOptional({
    description: 'Director de la película',
    example: 'George Lucas',
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiPropertyOptional({
    description: 'Productor de la película',
    example: 'Gary Kurtz, Rick McCallum',
  })
  @IsOptional()
  @IsString()
  producer?: string;

  @ApiPropertyOptional({
    description: 'Fecha de lanzamiento de la película',
    example: '1977-05-25',
  })
  @IsOptional()
  @IsDateString()
  release_date?: string;

  @ApiPropertyOptional({
    description: 'Lista de especies que aparecen en la película',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  species?: string[];

  @ApiPropertyOptional({
    description: 'Lista de naves espaciales que aparecen en la película',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  starships?: string[];

  @ApiPropertyOptional({
    description: 'Lista de vehículos que aparecen en la película',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vehicles?: string[];

  @ApiPropertyOptional({
    description: 'Lista de personajes que aparecen en la película',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characters?: string[];

  @ApiPropertyOptional({
    description: 'Lista de planetas que aparecen en la película',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  planets?: string[];

  @ApiPropertyOptional({
    description: 'URL de la película',
    example: 'https://swapi.dev/api/films/1/',
  })
  @IsOptional()
  @IsUrl()
  url?: string;
}
