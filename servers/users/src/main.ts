
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { UsersMicroservice } from '@ecommerce-event-driven/domain';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const kafkaBrokers = configService.get<string>('KAFKA_BROKERS')?.split(',') || ['localhost:9092'];

  await appContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: UsersMicroservice.clientId,
          brokers: kafkaBrokers,
        },
        consumer: {
          groupId: 'users-consumer-group',
        },
      },
    },
  );
  await app.listen();
  console.log('Users microservice is listening on Kafka');
}
bootstrap();
