import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../commons/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import {
  HttpStatus,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthController', () => {
  let app: INestApplication;

  // Crear mocks de los servicios
  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('login', () => {
    it('should login user successfully normalizing email', async () => {
      const loginResponse = {
        access_token: 'test_token',
        user: { id: 1, email: 'usuario@test.com' },
      };

      mockAuthService.login.mockResolvedValue(loginResponse);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'Usuario@TEST.com',
          password: 'password123',
        });

      expect(mockAuthService.login).toHaveBeenCalledWith(
        'usuario@test.com',
        'password123',
      );
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(loginResponse);
    });
    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'usuario@test.com',
          password: 'password123',
        });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
