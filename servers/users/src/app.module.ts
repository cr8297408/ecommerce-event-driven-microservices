import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database';
import { CreateUserUseCase } from './use-cases';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';
import { KafkaModule } from './kafka';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    KafkaModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AppController],
  providers: [AppService, CreateUserUseCase],
})
export class AppModule {}
