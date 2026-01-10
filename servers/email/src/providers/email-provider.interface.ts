export interface IEmailProvider {
  sendEmail(to: string, subject: string, content: string, html: string): Promise<void>;
}

export const EMAIL_PROVIDER = 'EMAIL_PROVIDER';
