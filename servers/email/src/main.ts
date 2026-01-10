import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { EmailMicroservice } from '@ecommerce-event-driven/domain';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {

  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const logger = new Logger('Bootstrap Email');
  logger.log('🚀 Starting Email microservice...');

  const kafkaBrokers = configService.get<string>('KAFKA_BROKERS')?.split(',') || [];
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: EmailMicroservice.clientId,
          brokers: kafkaBrokers,
        },
        consumer: {
          groupId: 'email-consumer-group',
        },
        subscribe: {
          fromBeginning: true,
        },
      },
    },
  );
  await app.listen();
  logger.log('📧 Email microservice is listening on Kafka');
}
bootstrap();
