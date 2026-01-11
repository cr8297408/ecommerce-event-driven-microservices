import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResendVerificationTokenEventData, Topics, UserCreatedEventData } from '@ecommerce-event-driven/domain';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  @MessagePattern(Topics.USER_CREATED)
  async handleUserCreated(@Payload() data: UserCreatedEventData) {
    this.logger.log(`📧 User created event received for ${data.emailAddress}`);
    try {
      await this.appService.sendActivationEmail(data.emailAddress, data.firstName + " " + data.lastName, data.verificationToken);
      this.logger.log(`✅ Email sent successfully to ${data.emailAddress}`);
    } catch (error) {
       this.logger.error(`❌ Failed to send email to ${data.emailAddress}: ${error.message}`);
    }
  }

  @MessagePattern(Topics.RESEND_VERIFICATION_TOKEN)
  async handleResendVerificationToken(@Payload() data: ResendVerificationTokenEventData) {
    this.logger.log(`📧 Resend verification token event received for ${data.email}`);
    try {
      await this.appService.handleResendVerificationToken(data.email, data.token);
      this.logger.log(`✅ Resend Email sent successfully to ${data.email}`);
    } catch (error) {
       this.logger.error(`❌ Failed to send email to ${data.email}: ${error.message}`);
    }
  }
}
