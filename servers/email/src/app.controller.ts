import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Topics, UserCreatedEventData } from '@ecommerce-event-driven/domain';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  async handleUserCreated(@Payload() data: UserCreatedEventData) {
    this.logger.log(`📧 User created event received for ${data.emailAddress}`);
    try {
      await this.appService.sendActivationEmail(data.emailAddress, data.firstName + " " + data.lastName, data.verificationToken);
      this.logger.log(`✅ Email sent successfully to ${data.emailAddress}`);
    } catch (error) {
       this.logger.error(`❌ Failed to send email to ${data.emailAddress}: ${error.message}`);
    }
  }
}
