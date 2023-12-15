import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService{
    constructor(private prismaService: PrismaService) {}
    
    signin() {
        return { msg: 'User signed in successfully.' }
    }

    signup() {
        return { msg: 'User signed up successfully.' }
    }
}