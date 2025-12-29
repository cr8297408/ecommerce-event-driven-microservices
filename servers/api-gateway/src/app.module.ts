import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { MicroservicesModule } from './microservices/microservices.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards';
import { JwtGlobalModule } from './jwt/jwt.module';

@Module({
  imports: [
    ConfigModule,
    MicroservicesModule,
    AuthModule,
    JwtGlobalModule
  ],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },],
})
export class AppModule { }
