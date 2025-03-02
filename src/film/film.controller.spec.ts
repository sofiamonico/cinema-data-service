import {
  ExecutionContext,
  HttpStatus,
  INestApplication,
  UnauthorizedException,
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
import { RoleType } from '../constants/role.constants';

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
  describe('FilmControllerForRoleAdmin', () => {
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
          created: new Date(),
          edited: new Date(),
        };
        mockFilmService.create.mockResolvedValue(film);

        const response = await request(app.getHttpServer())
          .post('/film/create')
          .send({
            title: 'Test Film',
            episode_id: 1,
            opening_crawl: 'Test opening crawl',
          });

        console.log(response);
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body).toEqual({
          message: 'Film created successfully',
          data: film,
          errors: [],
        });
      });
    });
  });
  describe('FilmControllerForRoleUser', () => {});
  describe('FilmControllerForAnyRole', () => {});
});
