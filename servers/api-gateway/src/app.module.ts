import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UsersMicroservice } from '@ecommerce-event-driven/domain';

@Module({
  imports: [ConfigModule, ClientsModule.registerAsync([
    {
      name: UsersMicroservice.name,
      useFactory: (configService: ConfigService) => ({
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: UsersMicroservice.clientId,
            brokers: configService.get<string>('KAFKA_BROKERS')?.split(',') || [],
          },
          consumer: {
            groupId: 'users-consumer-group-from-api-gateway',
          },
        },
      }),
      inject: [ConfigService],
    },
  ]),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
