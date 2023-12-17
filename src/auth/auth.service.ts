import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{
    constructor(private prismaService: PrismaService,
                private jwtService: JwtService,
                private configService: ConfigService) {}
    
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
    
            // delete user.hash;
            // return the saved user
            // return user;
            return this.signToken(user.id, user.email);
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
        // delete user.hash;
        // return user;
        return this.signToken(user.id, user.email);

        // return { msg: 'User signed in successfully.' }
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,                                // sub - kind of a convention
            email
        }

        const secret = this.configService.get('JWT_SECRET');

        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });
        
        return {
            access_token: token,
        };
    }

    
}