import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { Public } from './decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @Public()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: 'User registration request accepted' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async register(@Body() body: RegisterDto) {
        const response = await this.authService.register(body);
        return response;
    }

    @Post('login/password')
    @Public()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: 'User login request accepted' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async loginWithPassword(@Body() body: LoginDto) {
        const response = await this.authService.loginWithPassword(body);
        return response;
    }

    @Get('profile')
    getProfile(@Request() req) {
        // Implement user microservice call to fetch user profile using req.user.userId
        return req.user;
    }
}
