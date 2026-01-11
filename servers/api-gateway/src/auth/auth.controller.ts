import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Request } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto, VerifyAccountDto } from './dto';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { Request as ExpressRequest } from 'express';
import { type User } from '@ecommerce-event-driven/domain';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @Public()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: 'User registration request accepted' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async register(@Body() body: RegisterDto): Promise<{ message: string }> {
        this.logger.log(`📥 Incoming registration request for email: ${body.email}`);
        const response = await this.authService.register(body);
        return response;
    }

    @Post('login/password')
    @Public()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: 'User login request accepted' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async loginWithPassword(@Body() body: LoginDto): Promise<{ access_token: string }> {
        this.logger.log(`📥 Incoming login request for email: ${body.email}`);
        const response = await this.authService.loginWithPassword(body);
        return response;
    }

    @Post('account/verify')
    @Public()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: 'User account verification request accepted' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async verifyAccount(@Body() body: VerifyAccountDto): Promise<{ success: boolean; message: string }> {
        this.logger.log(`📥 Incoming account verification request`);
        const response = await this.authService.verifyAccount(body);
        return response;
    }

    @Get('profile')
    @ApiBearerAuth()
    getProfile(@Request() req: ExpressRequest & { user: User }): User {
        this.logger.log(`📥 Incoming profile request for user: ${req.user.emailAddress}`);
        // Implement user microservice call to fetch user profile using req.user.userId
        return req.user as User;
    }
}
