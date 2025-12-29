import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiAcceptedResponse({ description: 'User registration request accepted' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async register(@Body() body: RegisterDto) {
        const response = await this.authService.register(body);
        return response;
    }
}
