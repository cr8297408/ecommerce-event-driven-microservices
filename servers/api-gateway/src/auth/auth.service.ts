import { Inject, Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { CreateUserEvent, KAFKA_CLIENT, Topics, ValidateEmailAndPasswordEvent } from '@ecommerce-event-driven/domain';
import { ClientKafka } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        private jwtService: JwtService,
        @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    ) { }

    async onModuleInit() {
        this.kafkaClient.subscribeToResponseOf(Topics.VALIDATE_EMAIL_AND_PASSWORD);
        await this.kafkaClient.connect();
    }

    async register(body: RegisterDto) {
        const createUserEvent = new CreateUserEvent({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
        });

        // Emitimos al topic genérico, cualquier microservicio interesado lo consume
        this.kafkaClient.emit(createUserEvent.topic, createUserEvent.data);

        return {
            message: 'User registration in progress, you will receive an email once done.',
        }
    }

    async loginWithPassword(body: LoginDto) {
        // Send Validate User Email And Password Event to Users Microservice
        const validateUserEvent = new ValidateEmailAndPasswordEvent({
            email: body.email,
            password: body.password,
        });

        const response = await firstValueFrom(this.kafkaClient.send(validateUserEvent.topic, validateUserEvent.data));

        if (!response.emailIsActive && response.isValid) throw new UnauthorizedException('Email is not active');

        if (!response.isValid) throw new UnauthorizedException('Invalid email or password');

        const payload = { sub: response.user.id, email: response.user.email };

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
        };

    }
}
