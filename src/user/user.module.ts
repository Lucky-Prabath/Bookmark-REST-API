import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user.service';


@Module({
  imports: [PassportModule,],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
