import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";

@Injectable()
export class AuthService{
    constructor(private prismaService: PrismaService) {}
    
    signup(dto: AuthDto) {
        return { msg: 'User signed up successfully.' }
    }

    signin() {
        return { msg: 'User signed in successfully.' }
    }

}