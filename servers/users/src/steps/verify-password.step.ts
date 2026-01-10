import { Injectable, Logger } from '@nestjs/common';
import { scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

@Injectable()
export class VerifyPasswordStep {
  private readonly logger = new Logger(VerifyPasswordStep.name);

  async execute(password: string, storedHash: string): Promise<boolean> {
    this.logger.log('Executing VerifyPasswordStep');
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) {
        return false;
    }

    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const keyBuffer = Buffer.from(key, 'hex');
    
    return timingSafeEqual(derivedKey, keyBuffer);
  }
}
