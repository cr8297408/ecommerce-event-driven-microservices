import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { KafkaModule } from './kafka/kafka.module';
import { HashPasswordStep, GenerateVerificationTokenStep, CreateUserStep, FindUserByEmailStep, VerifyPasswordStep } from './steps';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    ConfigModule,
    DatabaseModule,
    KafkaModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, HashPasswordStep, GenerateVerificationTokenStep, CreateUserStep, FindUserByEmailStep, VerifyPasswordStep],
})
export class AppModule {}
