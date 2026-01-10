import { Inject, Injectable, Logger } from '@nestjs/common';
import { EMAIL_PROVIDER, IEmailProvider } from './providers';
import { TemplateService } from './services';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);

    constructor(
        @Inject(EMAIL_PROVIDER) private readonly emailProvider: IEmailProvider,
        private readonly templateService: TemplateService,
    ) { }

    async sendActivationEmail(to: string, name: string, token: string): Promise<void> {
        this.logger.log(`Preparing to send activation email to ${to}`);
        const subject = 'Activate your account';
        const link = `http://localhost:3000/activate?token=${token}`; // In real app, generate valid token
        
        const content = await this.templateService.getTemplate('activation', {
            name,
            link
        });
        
        // Plain text fallback
        const textContent = `Hello ${name}, please activate your account: ${link}`;
        
        await this.emailProvider.sendEmail(to, subject, textContent, content);
    }
}
