import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { IEmailProvider } from './email-provider.interface';

@Injectable()
export class SendGridProvider implements IEmailProvider {
  private readonly logger = new Logger(SendGridProvider.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      this.logger.warn('SENDGRID_API_KEY not found in configuration');
    } else {
      SendGrid.setApiKey(apiKey);
    }
  }

  async sendEmail(to: string, subject: string, content: string, html: string): Promise<void> {
    try {
      const from = this.configService.get<string>('SENDGRID_FROM_EMAIL') || 'noreply@example.com';
      await SendGrid.send({
        to,
        from,
        subject,
        text: content, 
        html,
      });
      this.logger.log(`Email sent to ${to} via SendGrid`);
    } catch (error) {
      this.logger.error(`Error sending email to ${to}: ${error.message}`, error.response?.body);
      throw error;
    }
  }
}
