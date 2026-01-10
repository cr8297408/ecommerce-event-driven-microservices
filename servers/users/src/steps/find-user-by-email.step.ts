import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class FindUserByEmailStep {
  private readonly logger = new Logger(FindUserByEmailStep.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(email: string): Promise<UserEntity | null> {
    this.logger.log(`Executing FindUserByEmailStep for ${email}`);
    return this.userRepository.findOne({ where: { emailAddress: email } });
  }
}
