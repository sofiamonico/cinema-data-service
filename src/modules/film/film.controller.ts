import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FilmService } from './film.service';
import {
  FilmDto,
  FilmResponseDto,
  FilmTitlesDto,
} from '../../dto/film/film.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleType } from '../../constants/role.constants';
import { plainToInstance } from 'class-transformer';
import { UpdateFilmDto } from '../../dto/film/update-film.dto';

@Controller('film')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  /**
   * Create a film
   * @param createFilmDto - The film to create
   * @returns {Promise<{ message: string; data: FilmDto; errors: string[] }>} The created film
   */
  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  async create(
    @Body() createFilmDto: FilmDto,
  ): Promise<{ message: string; data: FilmDto; errors: string[] }> {
    const result = await this.filmService.create(createFilmDto);
    return {
      message: 'Film created successfully',
      data: plainToInstance(FilmResponseDto, result),
      errors: [],
    };
  }

  /**
   * Find all films
   * @returns {Promise<{ message: string; data: FilmDto[]; errors: string[] }>} Array of films
   */
  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.USER, RoleType.SUPER_ADMIN)
  async findAll(): Promise<{
    message: string;
    data: FilmDto[];
    errors: string[];
  }> {
    const films = await this.filmService.findAllWithDetails();
    return {
      message: 'Films fetched successfully',
      data: plainToInstance(FilmResponseDto, films),
      errors: [],
    };
  }

  /**
   * Find all films titles
   * @returns {Promise<{ message: string; data: FilmTitlesDto[]; errors: string[] }>} Array of films titles
   */
  @Get('/titles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.USER, RoleType.SUPER_ADMIN)
  async findAllTitles(): Promise<{
    message: string;
    data: FilmTitlesDto[];
    errors: string[];
  }> {
    const films = await this.filmService.findAllTitles();
    return {
      message: 'Films titles fetched successfully',
      data: plainToInstance(FilmTitlesDto, films),
      errors: [],
    };
  }

  /**
   * Find one film by id
   * @param id - The id of the film
   * @returns {Promise<{ message: string; data: FilmResponseDto; errors: string[] }>} The film
   */
  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.USER)
  async findOne(@Param('id') id: number): Promise<{
    message: string;
    data: FilmResponseDto;
    errors: string[];
  }> {
    const film = await this.filmService.findOneById(id);
    return {
      message: 'Film fetched successfully',
      data: plainToInstance(FilmResponseDto, film),
      errors: [],
    };
  }

  /**
   * Update one film
   * @param id - The id of the film
   * @param updateFilmDto - The film to update
   * @returns {Promise<{ message: string; data: UpdateFilmDto; errors: string[] }>} The updated film
   */
  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  async update(
    @Param('id') id: number,
    @Body() updateFilmDto: UpdateFilmDto,
  ): Promise<{
    message: string;
    data: FilmResponseDto;
    errors: string[];
  }> {
    const film = await this.filmService.updateOne(id, updateFilmDto);
    return {
      message: 'Film updated successfully',
      data: plainToInstance(FilmResponseDto, film),
      errors: [],
    };
  }

  /**
   * Delete one film
   * @param id - The id of the film
   * @returns {Promise<{ message: string; data: boolean; errors: string[] }>} The deleted film
   */
  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  async delete(@Param('id') id: number): Promise<{
    message: string;
    data: boolean;
    errors: string[];
  }> {
    const result = await this.filmService.removeOne(id);
    return {
      message: 'Film deleted successfully',
      data: result,
      errors: [],
    };
  }
}
