import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService{
    
    signin() {
        return { msg: 'User signed in successfully.' }
    }

    signup() {
        return { msg: 'User signed up successfully.' }
    }
}