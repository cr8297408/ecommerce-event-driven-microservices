import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_CLIENT, UserCreatedEvent, UserCreationFailedEvent, CreateUserEventData } from '@ecommerce-event-driven/domain';
import { CreateUserUseCase } from './use-cases';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async onModuleInit() {
    // Conectar el cliente Kafka al iniciar el módulo
    await this.kafkaClient.connect();
    this.logger.log('Kafka producer connected');
  }

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(data: CreateUserEventData) {
    try {
      const user = await this.createUserUseCase.execute(data);

      const userCreatedEvent = new UserCreatedEvent({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        phoneNumber: user.phoneNumber,
        profileImageKey: user.profileImageKey,
        status: user.status,
        createdAt: user.createdAt,
      });

      this.logger.log(`📤 Emitting UserCreatedEvent: ${JSON.stringify(userCreatedEvent.data)}`);
      this.kafkaClient.emit(userCreatedEvent.topic, userCreatedEvent.data);
    } catch (error) {
       this.logger.error(`Error processing user creation: ${error.message}`);
       const userCreationFailedEvent = new UserCreationFailedEvent({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        error: error.message,
      });
      this.logger.log(`📤 Emitting UserCreationFailedEvent: ${JSON.stringify(userCreationFailedEvent.data)}`);
      this.kafkaClient.emit(userCreationFailedEvent.topic, userCreationFailedEvent.data);
      throw error;
    }
  }
}
