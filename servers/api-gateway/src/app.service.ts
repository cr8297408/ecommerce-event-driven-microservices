import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UsersMicroservice, CreateUserEvent } from '@ecommerce-event-driven/domain';

@Injectable()
export class AppService {
  constructor(
    @Inject(UsersMicroservice.name) private readonly usersClient: ClientKafka,
  ) {}

  getHello(): string {
    const userCreateEvent = new CreateUserEvent({ name: 'John Doe', email: 'john.doe@example.com', password: 123456 });
    this.usersClient.emit(userCreateEvent.topic, userCreateEvent.data);
    return 'Hello World!';
  }
}
