import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FilmDto {
  @ApiProperty({
    description: 'Título de la película',
    example: 'Star Wars: A New Hope',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Número de episodio de la película', example: 4 })
  @IsNotEmpty()
  @IsNumber()
  episode_id: number;

  @ApiProperty({
    description: 'Texto de apertura de la película',
    example: 'It is a period of civil war...',
  })
  @IsNotEmpty()
  @IsString()
  opening_crawl: string;

  @ApiProperty({
    description: 'Director de la película',
    example: 'George Lucas',
  })
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({
    description: 'Productor de la película',
    example: 'Gary Kurtz, Rick McCallum',
  })
  @IsNotEmpty()
  @IsString()
  producer: string;

  @ApiProperty({
    description: 'Fecha de lanzamiento de la película',
    example: '1977-05-25',
  })
  @IsNotEmpty()
  @IsDateString()
  release_date: string;

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

  @ApiProperty({
    description: 'URL de la película',
    example: 'https://swapi.dev/api/films/1/',
  })
  @IsNotEmpty()
  @IsUrl()
  url: string;
}

export class FilmResponseDto extends FilmDto {
  @ApiProperty({
    description: 'Identificador único de la película',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class FilmTitlesDto {
  @ApiProperty({
    description: 'Título de la película',
    example: 'Star Wars: A New Hope',
  })
  @IsNotEmpty()
  @IsString()
  title: string;
}
