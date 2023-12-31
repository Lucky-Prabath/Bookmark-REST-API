import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {
    }

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto);
    }

    // use a pipe to convert to numbers
    // @Post('signup')
    // signup(
    //     @Body('email') email: string, 
    //     @Body('password', ParseIntPipe) password: string
    //     ) {
    //     console.log({
    //         email,
    //         typeOfEmail: typeof email,
    //         password,
    //         typeOfPassword: typeof password
    //     });
    //     return this.authService.signup();
    // }

    @HttpCode(HttpStatus.OK)  // return 200 using decorator
    @Post('signin')
    signin(@Body() dto: AuthDto) {
        return this.authService.signin(dto);
    }
}