import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule, ClientsModule.registerAsync([
    {
      name: 'PRODUCT_SERVICE',
      useFactory: (configService: ConfigService) => ({
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: configService.get<string>('KAFKA_BROKERS')?.split(',') || [],
          },
          consumer: {
            groupId: 'product-consumer',
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
