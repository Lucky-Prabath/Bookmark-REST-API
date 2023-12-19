import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [PassportModule,],
  controllers: [UserController]
})
export class UserModule {}
