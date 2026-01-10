import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { CreateUserEvent, KAFKA_CLIENT, Topics, ValidateEmailAndPasswordEvent } from '@ecommerce-event-driven/domain';
import { ClientKafka } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    ) { }

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

        const response = await this.kafkaClient.send(validateUserEvent.topic, validateUserEvent.data)[0]
        // Generate Token if password is valid
        if (!response.isValid) {
            throw new UnauthorizedException();
        }

        const payload = { sub: response.user.userId, email: response.user.email };

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
        };

    }
}
