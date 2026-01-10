import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

type TemplateName = "activation" | "passwordReset";

@Injectable()
export class TemplateService {
    private readonly logger = new Logger(TemplateService.name);
    private readonly templatesDir = path.join(__dirname, '..', 'templates');

    async getTemplate(templateName: TemplateName, data: Record<string, string>): Promise<string> {
        const filePath = path.join(this.templatesDir, `${templateName}.html`);
        
        try {
            this.logger.log(`Loading template from: ${filePath}`);
            let content = await fs.readFile(filePath, 'utf-8');
            
            // Simple replacement for {{key}}
            Object.keys(data).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                content = content.replace(regex, data[key]);
            });

            return content;
        } catch (error) {
            this.logger.error(`Error loading template ${templateName}: ${error.message}`);
            throw error;
        }
    }
}
