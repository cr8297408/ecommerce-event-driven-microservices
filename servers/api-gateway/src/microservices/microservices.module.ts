import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersMicroservice } from '@ecommerce-event-driven/domain';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: UsersMicroservice.name,
        imports: [ConfigModule],
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
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroservicesModule {}
