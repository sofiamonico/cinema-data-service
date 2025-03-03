import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilmTable1741028581126 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS film (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        episode_id INTEGER NOT NULL,
        opening_crawl TEXT NOT NULL,
        director VARCHAR(255) NOT NULL,
        producer VARCHAR(255) NOT NULL,
        release_date DATE NOT NULL,
        species TEXT[] NULL,
        starships TEXT[] NULL,
        vehicles TEXT[] NULL,
        characters TEXT[] NOT NULL,
        planets TEXT[] NULL,
        url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS film
    `);
  }
}
