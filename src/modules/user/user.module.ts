import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';
import { GuardsModule } from '../auth/guards/guards.module';
import { UserCommand } from './user.command';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, GuardsModule],
  controllers: [UserController],
  providers: [UserService, UserCommand],
  exports: [UserService],
})
export class UserModule {}
