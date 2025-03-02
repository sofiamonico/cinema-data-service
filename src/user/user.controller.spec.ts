import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  HttpStatus,
  INestApplication,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as request from 'supertest';
import { RoleType } from '../constants/role.constants';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('UserController', () => {
  let app: INestApplication;

  // Crear mocks de los servicios
  const mockUserService = {
    create: jest.fn(),
    updateRoleByEmail: jest.fn(),
    deleteUserRoleByEmail: jest.fn(),
    remove: jest.fn(),
    findByEmail: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: 'test-secret-key',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
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
    it('should create a user', async () => {
      mockUserService.create.mockResolvedValue(true);
      const response = await request(app.getHttpServer())
        .post('/user/create')
        .send({ email: 'test@test.com', password: 'test' });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual({
        message: 'User created successfully',
        data: true,
        errors: [],
      });
      expect(mockUserService.create).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'test',
      });
    });

    it('should throw an error if the user is not created', async () => {
      mockUserService.create.mockRejectedValue(
        new ConflictException('Email already exists'),
      );
      const response = await request(app.getHttpServer())
        .post('/user/create')
        .send({ email: 'test@test.com', password: 'test' });
      expect(response.status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('updateRoleByEmail (Protected - Admin Only)', () => {
    it('should allow an admin to update roles', async () => {
      mockUserService.updateRoleByEmail.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'test',
        roles: [RoleType.ADMIN],
      });

      const response = await request(app.getHttpServer())
        .patch('/user/update-role/test@test.com')
        .set('Authorization', `Bearer mock-token`)
        .send({ roleSlug: RoleType.ADMIN });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        message: 'User roles updated successfully',
        data: {
          email: 'test@test.com',
          roles: [RoleType.ADMIN],
        },
        errors: [],
      });
      expect(mockUserService.updateRoleByEmail).toHaveBeenCalledWith(
        'test@test.com',
        RoleType.ADMIN,
      );
    });

    it('should reject requests without a token', async () => {
      const response = await request(app.getHttpServer())
        .patch('/user/update-role/test@test.com')
        .send({ roleSlug: RoleType.ADMIN });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should reject requests because the user is not found', async () => {
      mockUserService.updateRoleByEmail.mockRejectedValue(
        new NotFoundException('User not found'),
      );
      const response = await request(app.getHttpServer())
        .patch('/user/update-role/test@test.com')
        .set('Authorization', `Bearer mock-token`)
        .send({ roleSlug: RoleType.ADMIN });
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('deleteUserRoleByEmail (Protected - Admin Only)', () => {
    it('should allow an admin to delete roles', async () => {
      mockUserService.deleteUserRoleByEmail.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        password: 'test',
        roles: [RoleType.USER],
      });

      const response = await request(app.getHttpServer())
        .delete('/user/delete-role/test@test.com')
        .set('Authorization', `Bearer mock-token`)
        .send({ roleSlug: RoleType.ADMIN });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        message: 'User role deleted successfully',
        data: {
          email: 'test@test.com',
          roles: [RoleType.USER],
        },
        errors: [],
      });
      expect(mockUserService.deleteUserRoleByEmail).toHaveBeenCalledWith(
        'test@test.com',
        RoleType.ADMIN,
      );
    });
    it('should reject requests because the user is not found', async () => {
      mockUserService.deleteUserRoleByEmail.mockRejectedValue(
        new NotFoundException('User not found'),
      );
      const response = await request(app.getHttpServer())
        .delete('/user/delete-role/test@test.com')
        .set('Authorization', `Bearer mock-token`)
        .send({ roleSlug: RoleType.ADMIN });
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('deleteUser (Protected - Admin Only)', () => {
    it('should allow an admin to delete a user', async () => {
      mockUserService.remove.mockResolvedValue(true);
      const response = await request(app.getHttpServer())
        .delete('/user/delete/1')
        .set('Authorization', `Bearer mock-token`)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        message: 'User deleted successfully',
        data: true,
        errors: [],
      });
    });
  });
});
