import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KAFKA_CLIENT, UsersMicroservice } from '@ecommerce-event-driven/domain';

/**
 * KafkaModule
 * 
 * Este módulo configura un cliente Kafka para que el microservicio de usuarios
 * pueda EMITIR eventos a Kafka (ej: UserCreatedEvent).
 * 
 * Arquitectura Event-Driven:
 * - El microservicio de usuarios consume eventos (ej: CreateUser)
 * - Cuando termina de procesar, EMITE nuevos eventos (ej: UserCreated)
 * - Cualquier otro microservicio interesado puede suscribirse a esos eventos
 */
@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENT,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: `${UsersMicroservice.clientId}-producer`,
              brokers: configService.get<string>('KAFKA_BROKERS')?.split(',') || [],
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
