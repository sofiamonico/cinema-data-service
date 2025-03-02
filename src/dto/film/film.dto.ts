import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class FilmDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  episode_id: number;

  @IsNotEmpty()
  @IsString()
  opening_crawl: string;

  @IsNotEmpty()
  @IsString()
  director: string;

  @IsNotEmpty()
  @IsString()
  producer: string;

  @IsNotEmpty()
  @IsDateString()
  release_date: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  species?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  starships?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vehicles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characters?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  planets?: string[];

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsDateString()
  created: string;

  @IsNotEmpty()
  @IsDateString()
  edited: string;
}

export class FilmResponseDto extends FilmDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class FilmTitlesDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
