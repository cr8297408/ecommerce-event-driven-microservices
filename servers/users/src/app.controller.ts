import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { type CreateUserEventData, Topics } from '@ecommerce-event-driven/domain';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern(Topics.CREATE_USER) // Cambia 'some-topic' por el topic real que quieres escuchar
  handleKafkaMessage(@Payload() message: CreateUserEventData) {
    this.logger.log(`📥 Mensaje recibido en Kafka: ${JSON.stringify(message)}`);
    // Aquí puedes procesar el mensaje o delegar a un servicio
    return true;
  }
}
