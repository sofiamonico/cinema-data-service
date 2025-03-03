import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { FilmModule } from './modules/film/film.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommandModule } from 'nestjs-command';
import { GuardsModule } from './modules/auth/guards/guards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    CommandModule,
    GuardsModule,
    RoleModule,
    UserModule,
    FilmModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
