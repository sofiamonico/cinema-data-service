import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleTableWithRoles1741027664279
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tipo enum para roles
    await queryRunner.query(`
      CREATE TYPE role_type AS ENUM ('admin', 'user', 'superadmin')
    `);

    // Crear tabla de roles
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role (
        id SERIAL PRIMARY KEY,
        slug role_type NOT NULL UNIQUE DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insertar roles predeterminados
    await queryRunner.query(`
      INSERT INTO role (slug) 
      VALUES ('admin'), ('user'), ('superadmin')
      ON CONFLICT (slug) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tabla y tipo enum
    await queryRunner.query(`
      DROP TABLE IF EXISTS role
    `);

    await queryRunner.query(`
      DROP TYPE IF EXISTS role_type
    `);
  }
}
