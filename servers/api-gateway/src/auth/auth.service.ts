import { Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto';
import { CreateUserEvent, UsersMicroservice } from '@ecommerce-event-driven/domain';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthService {

    constructor(
        @Inject(UsersMicroservice.name) private readonly usersClient: ClientKafka,
    ) { }


    async register(body: RegisterDto) {

        const createUserEvent = new CreateUserEvent({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: body.password,
        });

        this.usersClient.emit(createUserEvent.topic, createUserEvent.data);

        return {
            message: 'User registration in progress, you will receive an email once done.',
        }
    }
}
