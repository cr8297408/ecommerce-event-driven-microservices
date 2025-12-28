// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AddressEntity, UserEntity } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get<string>('POSTGRES_DB_HOST'),
      port: configService.get<number>('POSTGRES_DB_PORT'),
      username: configService.get<string>('POSTGRES_DB_USERNAME'),
      password: configService.get<string>('POSTGRES_DB_PASSWORD'),
      database: configService.get<string>('POSTGRES_DB_NAME'),
      entities: [UserEntity, AddressEntity],
    }),
  }),],
})
export class DatabaseModule { }
