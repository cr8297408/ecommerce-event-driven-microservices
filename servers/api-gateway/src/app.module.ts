import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerModule } from './producer/producer.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ProducerModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
