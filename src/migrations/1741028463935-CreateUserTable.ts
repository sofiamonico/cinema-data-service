import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1741028463935 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla de usuarios
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de unión para la relación ManyToMany entre usuarios y roles
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users_roles_role (
        user_id INTEGER NOT NULL,
        role_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, role_id),
        CONSTRAINT fk_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_role
          FOREIGN KEY (role_id)
          REFERENCES role(id)
          ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tabla de unión
    await queryRunner.query(`
      DROP TABLE IF EXISTS users_roles_role
    `);

    // Eliminar tabla de usuarios
    await queryRunner.query(`
      DROP TABLE IF EXISTS users
    `);
  }
}
