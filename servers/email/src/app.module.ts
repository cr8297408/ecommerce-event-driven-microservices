import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EMAIL_PROVIDER, SendGridProvider } from './providers';
import { TemplateService } from './services';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [
    AppService,
    TemplateService,
    {
      provide: EMAIL_PROVIDER,
      useClass: SendGridProvider,
    },
  ],
})
export class AppModule {}
