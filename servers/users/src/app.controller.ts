import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { type CreateUserEventData, Topics, type ValidateEmailAndPasswordEventData } from '@ecommerce-event-driven/domain';
import { CreateUserSchema, ValidateEmailAndPasswordSchema } from './validations';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @MessagePattern(Topics.CREATE_USER)
  async handleKafkaMessage(@Payload() message: CreateUserEventData) {
    this.logger.log(`📥 Mensaje recibido en Kafka: ${JSON.stringify(message)}`);

    try {
      const cleanMessage = await CreateUserSchema.validateAsync(message, { stripUnknown: true });
      await this.appService.createUser(cleanMessage);
    } catch (error) {
      this.logger.error(`Error de validación: ${error.message}`);
      throw new Error(`Validation Error: ${error.message}`);
    }
  }

  @MessagePattern(Topics.VALIDATE_EMAIL_AND_PASSWORD)
  async handleValidateEmailAndPassword(@Payload() data: ValidateEmailAndPasswordEventData) {
    this.logger.log(`📥 Mensaje recibido en Kafka: ${JSON.stringify(data)}`);
    try {
      const cleanMessage = await ValidateEmailAndPasswordSchema.validateAsync(data, { stripUnknown: true });
      return await this.appService.validateEmailAndPassword(cleanMessage);
    } catch (error) {
      this.logger.error(`Error de validación: ${error.message}`);
      throw new Error(`Validation Error: ${error.message}`);
    }
  }
}
