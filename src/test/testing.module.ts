import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TestDatabaseModule } from './database.module';

export class BaseTestingModule {
  protected app: INestApplication;
  protected module: TestingModule;

  async createTestingModule(metadata: any) {
    this.module = await Test.createTestingModule({
      imports: [TestDatabaseModule, ...metadata.imports],
      controllers: metadata.controllers || [],
      providers: metadata.providers || [],
    }).compile();

    this.app = this.module.createNestApplication();
    await this.app.init();
  }

  async dropDatabase() {
    const dataSource = this.app.get(DataSource);
    await dataSource.dropDatabase();
  }

  async closeTestingModule() {
    const dataSource = this.app.get(DataSource);
    await dataSource.destroy();
    await this.app.close();
  }

  get testModule(): TestingModule {
    return this.module;
  }

  get testApp(): INestApplication {
    return this.app;
  }
}
