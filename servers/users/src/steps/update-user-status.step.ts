import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserStatus } from '../enums';

@Injectable()
export class UpdateUserStatusStep {
  private readonly logger = new Logger(UpdateUserStatusStep.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(userId: string, status: UserStatus): Promise<void> {
    this.logger.log(`Updating status for user ${userId} to ${status}`);
    await this.userRepository.update({ id: userId }, { status });
  }
}
