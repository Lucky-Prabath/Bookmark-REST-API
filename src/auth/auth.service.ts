import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService{
    constructor(private prismaService: PrismaService) {}
    
    async signup(dto: AuthDto) {
        // generate the password hash
        const hash = await argon.hash(dto.password);
        // save the new user in the db
        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                hash
            },
        });

        delete user.hash;
        // return the saved user
        return user;
        // return { msg: 'User signed up successfully.' }
    }

    // the way of returning required fields only
    /* async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        const user = await this.prismaService.user.create({
            data: {
                email: dto.email,
                hash
            },
            // return required fields
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
        return user;
    } */

    signin() {
        return { msg: 'User signed in successfully.' }
    }

}