import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService{
    constructor(private prismaService: PrismaService) {}
    
    async signup(dto: AuthDto) {
        // generate the password hash
        const hash = await argon.hash(dto.password);
        // save the new user in the db
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    hash
                },
            });
    
            delete user.hash;
            // return the saved user
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            throw error;
        }
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

    async signin(dto: AuthDto) {
        // find the user by email
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            },
        })
        // id user does not exists throw exception
        if (!user) {
            throw new ForbiddenException('Credentials incorrect.');
        }
        // compare password
        const pwdMatches  = await argon.verify(user.hash, dto.password);
        // if password is incorrect throw exception
        if (!pwdMatches) {
            throw new ForbiddenException('Credentials incorrect');
        }
        // if all success, send back the user
        delete user.hash;
        return user;

        /* try {
            const user = await this.prismaService.user.findUniqueOrThrow({
                where: {
                    email: dto.email
                }
            });
            if (await argon.verify(user.hash, dto.password)) {
                delete user.hash;
                return user;
            } else {
                throw new BadRequestException("Invalid password.");
            }
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Cannot find the user.');
            }
        } */
        // return { msg: 'User signed in successfully.' }
    }

}