import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateVerificationTokenStep {
  private readonly logger = new Logger(GenerateVerificationTokenStep.name);

  constructor(private readonly jwtService: JwtService) {}

  execute(email: string): string {
    this.logger.log('Executing GenerateVerificationTokenStep');
    return this.jwtService.sign({ email });
  }
}
