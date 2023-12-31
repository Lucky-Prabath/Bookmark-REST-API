import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    // get other attributes also from decorator
   /*  @Get('me')
    getMe(@GetUser() user: User, @GetUser('email') email: string) {
        console.log({
            email,
        });
        return user;
    } */

    @Patch()
    editUser(@GetUser() user: User, @Body() dto: EditUserDto) {
        return this.userService.editUser(user.id, dto);
    }
}
