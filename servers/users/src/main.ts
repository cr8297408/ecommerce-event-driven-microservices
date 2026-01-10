

import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { UsersMicroservice } from '@ecommerce-event-driven/domain';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const logger = new Logger('Bootstrap');
  logger.log('🚀 Starting Users microservice...');

  const kafkaBrokers = configService.get<string>('KAFKA_BROKERS')?.split(',') || [];

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
        subscribe: {
          fromBeginning: true,
        },
      },
    },
  );
  await app.listen();
  logger.log('🟢✨ Users microservice is listening on Kafka! ✨🟢');
}
bootstrap();
