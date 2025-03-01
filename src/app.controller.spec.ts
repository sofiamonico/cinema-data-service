import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('App Controller', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  it('/GET /ping returns service is online', async () => {
    const response: any = await request(app.getHttpServer()).get('/ping');

    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(expect.stringContaining('online'));
  });

  afterAll(async () => {
    await app.close();
  });
});
