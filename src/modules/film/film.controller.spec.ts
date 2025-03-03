import {
  ExecutionContext,
  HttpStatus,
  INestApplication,
  NotFoundException,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { FilmService } from './film.service';
import { FilmController } from './film.controller';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RoleType } from '../../constants/role.constants';
import { HttpExceptionFilter } from '../../exception-filters/http-exception.filter';

describe('FilmController', () => {
  let app: INestApplication;

  // Crear mocks de los servicios
  const mockFilmService = {
    create: jest.fn(),
    findAllWithDetails: jest.fn(),
    findAllTitles: jest.fn(),
    findOneById: jest.fn(),
    updateOne: jest.fn(),
    removeOne: jest.fn(),
  };

  const createMockJwtAuthGuard = (userRole: string[]) => ({
    canActivate: (context: ExecutionContext) => {
      const reflector = new Reflector();
      const isPublic = reflector.get<boolean>('isPublic', context.getHandler());
      const req = context.switchToHttp().getRequest();

      if (isPublic || req.headers.authorization) {
        req.user = {
          email: 'test@admin.com',
          roles: userRole,
        };
        return true;
      }
      throw new UnauthorizedException();
    },
  });

  const createMockRolesGuard = (allowedRoles: string[]) => ({
    canActivate: (context: ExecutionContext) => {
      const reflector = new Reflector();
      const roles = reflector.get<string[]>('roles', context.getHandler());
      context.switchToHttp().getRequest();

      if (!roles) return true;
      return roles.some((role) => allowedRoles.includes(role));
    },
  });
  describe('FilmControllerWithRoleAdmin', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          JwtModule.register({
            secret: 'test-secret-key',
            signOptions: { expiresIn: '1h' },
          }),
        ],
        controllers: [FilmController],
        providers: [
          {
            provide: FilmService,
            useValue: mockFilmService,
          },
        ],
      })
        .overrideGuard(JwtAuthGuard)
        .useValue(createMockJwtAuthGuard([RoleType.ADMIN]))
        .overrideGuard(RolesGuard)
        .useValue(createMockRolesGuard([RoleType.ADMIN]))
        .compile();

      app = module.createNestApplication();
      // Interceptor to format response
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
      app.useGlobalFilters(new HttpExceptionFilter());

      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    describe('create', () => {
      it('should create a film', async () => {
        const film = {
          id: 1,
          title: 'Test Film',
          episode_id: 1,
          opening_crawl: 'Test opening crawl',
          director: 'Test director',
          producer: 'Test producer',
          release_date: '2024-01-01',
          characters: ['Test character 1', 'Test character 2'],
          url: 'https://test.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockFilmService.create.mockResolvedValue(film);

        const response = await request(app.getHttpServer())
          .post('/film/create')
          .set('Authorization', `Bearer mock-token`)
          .send({
            title: 'Test Film',
            episode_id: 1,
            opening_crawl: 'Test opening crawl',
            director: 'Test director',
            producer: 'Test producer',
            release_date: '2024-01-01',
            characters: ['Test character 1', 'Test character 2'],
            url: 'https://test.com',
          });

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          message: 'Film created successfully',
          data: film,
          errors: [],
        });
      });
      it.each([
        ['title', 'string', null, 'title should not be empty'],
        ['title', 'string', 123, 'title must be a string'],
        ['episode_id', 'number', null, 'episode_id should not be empty'],
        [
          'episode_id',
          'number',
          'not a number',
          'episode_id must be a number conforming to the specified constraints',
        ],
        ['opening_crawl', 'string', null, 'opening_crawl should not be empty'],
        ['opening_crawl', 'string', 123, 'opening_crawl must be a string'],
        ['director', 'string', null, 'director should not be empty'],
        ['director', 'string', 123, 'director must be a string'],
        ['producer', 'string', null, 'producer should not be empty'],
        ['producer', 'string', 123, 'producer must be a string'],
        ['release_date', 'date', null, 'release_date should not be empty'],
        [
          'release_date',
          'date',
          'invalid-date',
          'release_date must be a valid ISO 8601 date string',
        ],
        ['url', 'url', null, 'url should not be empty'],
        ['url', 'url', 'invalid-url', 'url must be a URL address'],
      ])(
        'should fail when %s is %s and receives %s (expecting %s error)',
        async (field: string, type, invalidValue, expectedError) => {
          const validFilm = {
            title: 'Test Film',
            episode_id: 1,
            opening_crawl: 'Test opening crawl',
            director: 'Test director',
            producer: 'Test producer',
            release_date: '2024-01-01',
            characters: ['Test character 1'],
            url: 'https://test.com',
          };

          const testFilm: Record<string, unknown> = { ...validFilm };
          if (invalidValue === null) {
            delete testFilm[field];
          } else {
            testFilm[field] = invalidValue;
          }

          const response = await request(app.getHttpServer())
            .post('/film/create')
            .set('Authorization', `Bearer mock-token`)
            .send(testFilm);
          expect(response.status).toBe(HttpStatus.BAD_REQUEST);
          expect(response.body.message).toContain('POST Bad Request Exception');
          expect(response.body.errors).toContain(expectedError);
        },
      );
    });
    describe('findAll', () => {
      it('should return all films', async () => {
        const films = [
          {
            id: 1,
            title: 'Test Film',
            episode_id: 1,
            opening_crawl: 'Test opening crawl',
            director: 'Test director',
            producer: 'Test producer',
            release_date: '2024-01-01',
            characters: ['Test character 1'],
            url: 'https://test.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'Test Film 2',
            episode_id: 2,
            opening_crawl: 'Test opening crawl 2',
            director: 'Test director 2',
            producer: 'Test producer 2',
            release_date: '2024-01-02',
            characters: ['Test character 2'],
            url: 'https://test.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        mockFilmService.findAllWithDetails.mockResolvedValue(films);

        const response = await request(app.getHttpServer())
          .get('/film/all')
          .set('Authorization', `Bearer mock-token`);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          message: 'Films fetched successfully',
          data: films,
          errors: [],
        });
        expect(response.body.data.length).toBe(2);
      });
    });
    describe('findAllTitles', () => {
      it('should return all films titles', async () => {
        const films = [{ title: 'Test Film' }, { title: 'Test Film 2' }];
        mockFilmService.findAllTitles.mockResolvedValue(films);

        const response = await request(app.getHttpServer())
          .get('/film/titles')
          .set('Authorization', `Bearer mock-token`);

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          message: 'Films titles fetched successfully',
          data: films,
          errors: [],
        });
      });
    });
    describe('findOne', () => {
      it('should failed because the user is not user', async () => {
        const response = await request(app.getHttpServer())
          .get('/film/1')
          .set('Authorization', `Bearer mock-token`);

        expect(response.status).toBe(HttpStatus.FORBIDDEN);
        expect(response.body.message).toBe('GET Forbidden resource');
        expect(response.body.errors).toStrictEqual(['Forbidden resource']);
      });
    });
    describe('update', () => {
      it('should  return the updated film', async () => {
        const updatedFilm = {
          id: 1,
          title: 'Updated Test Film',
          episode_id: 1,
          opening_crawl: 'Updated opening crawl',
          director: 'Updated director',
          producer: 'Updated producer',
          release_date: '2024-01-01',
          characters: ['Updated character 1'],
          url: 'https://test.com',
        };
        mockFilmService.updateOne.mockResolvedValue(updatedFilm);
        const response = await request(app.getHttpServer())
          .patch('/film/1')
          .set('Authorization', `Bearer mock-token`)
          .send({
            director: 'Updated director',
          });

        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          message: 'Film updated successfully',
          data: updatedFilm,
          errors: [],
        });
      });
      it('should failed because the film does not exist', async () => {
        mockFilmService.updateOne.mockRejectedValue(
          new NotFoundException('Film with id 1 not found'),
        );
        const response = await request(app.getHttpServer())
          .patch('/film/1')
          .set('Authorization', `Bearer mock-token`);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(response.body.message).toBe('PATCH Film with id 1 not found');
        expect(response.body.errors).toStrictEqual([
          'Film with id 1 not found',
        ]);
      });
    });
    describe('delete', () => {
      it('should delete a film', async () => {
        mockFilmService.removeOne.mockResolvedValue(true);
        const response = await request(app.getHttpServer())
          .delete('/film/1')
          .set('Authorization', `Bearer mock-token`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          message: 'Film deleted successfully',
          data: true,
          errors: [],
        });
      });
      it('should failed because the film does not exist', async () => {
        mockFilmService.removeOne.mockRejectedValue(
          new NotFoundException('Film with id 1 not found'),
        );
        const response = await request(app.getHttpServer())
          .delete('/film/1')
          .set('Authorization', `Bearer mock-token`);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(response.body.message).toBe('DELETE Film with id 1 not found');
        expect(response.body.errors).toStrictEqual([
          'Film with id 1 not found',
        ]);
      });
    });
  });
  describe('FilmControllerWithRoleUser', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          JwtModule.register({
            secret: 'test-secret-key',
            signOptions: { expiresIn: '1h' },
          }),
        ],
        controllers: [FilmController],
        providers: [
          {
            provide: FilmService,
            useValue: mockFilmService,
          },
        ],
      })
        .overrideGuard(JwtAuthGuard)
        .useValue(createMockJwtAuthGuard([RoleType.USER]))
        .overrideGuard(RolesGuard)
        .useValue(createMockRolesGuard([RoleType.USER]))
        .compile();

      app = module.createNestApplication();
      // Interceptor to format response
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
      app.useGlobalFilters(new HttpExceptionFilter());

      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    describe('create', () => {
      it('should failed because the user is not admin', async () => {
        const response = await request(app.getHttpServer())
          .post('/film/create')
          .set('Authorization', `Bearer mock-token`);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
        expect(response.body.message).toBe('POST Forbidden resource');
        expect(response.body.errors).toStrictEqual(['Forbidden resource']);
      });
    });
    describe('findOne', () => {
      it('should return the film', async () => {
        mockFilmService.findOneById.mockResolvedValue({
          id: 1,
          title: 'Test Film',
          episode_id: 1,
          opening_crawl: 'Test opening crawl',
          director: 'Test director',
          producer: 'Test producer',
          release_date: '2024-01-01',
          characters: ['Test character 1'],
          url: 'https://test.com',
        });
        const response = await request(app.getHttpServer())
          .get('/film/1')
          .set('Authorization', `Bearer mock-token`);
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body).toEqual({
          message: 'Film fetched successfully',
          data: {
            id: 1,
            title: 'Test Film',
            episode_id: 1,
            opening_crawl: 'Test opening crawl',
            director: 'Test director',
            producer: 'Test producer',
            release_date: '2024-01-01',
            characters: ['Test character 1'],
            url: 'https://test.com',
          },
          errors: [],
        });
      });
      it('should failed because the film does not exist', async () => {
        mockFilmService.findOneById.mockRejectedValue(
          new NotFoundException('Film with id 1 not found'),
        );
        const response = await request(app.getHttpServer())
          .get('/film/1')
          .set('Authorization', `Bearer mock-token`);
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(response.body.message).toBe('GET Film with id 1 not found');
        expect(response.body.errors).toStrictEqual([
          'Film with id 1 not found',
        ]);
      });
    });
    describe('update', () => {
      it('should failed because the user is not admin', async () => {
        const response = await request(app.getHttpServer())
          .patch('/film/1')
          .set('Authorization', `Bearer mock-token`);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
        expect(response.body.message).toBe('PATCH Forbidden resource');
        expect(response.body.errors).toStrictEqual(['Forbidden resource']);
      });
    });
    describe('delete', () => {
      it('should failed because the user is not admin', async () => {
        const response = await request(app.getHttpServer())
          .delete('/film/1')
          .set('Authorization', `Bearer mock-token`);
        expect(response.status).toBe(HttpStatus.FORBIDDEN);
        expect(response.body.message).toBe('DELETE Forbidden resource');
        expect(response.body.errors).toStrictEqual(['Forbidden resource']);
      });
    });
  });
});
