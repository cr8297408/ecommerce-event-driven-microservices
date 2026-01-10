import { Injectable, Logger } from '@nestjs/common';
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

@Injectable()
export class HashPasswordStep {
  private readonly logger = new Logger(HashPasswordStep.name);

  async execute(password: string): Promise<string> {
    this.logger.log('Executing HashPasswordStep');
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }
}
