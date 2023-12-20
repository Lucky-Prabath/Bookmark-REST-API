import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

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
    editUser() {}
}
