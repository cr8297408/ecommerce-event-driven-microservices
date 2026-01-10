import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserEventData } from '@ecommerce-event-driven/domain';
import { UserStatus } from '../enums';

@Injectable()
export class CreateUserStep {
  private readonly logger = new Logger(CreateUserStep.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    data: CreateUserEventData, 
    hashedPassword: string
  ): Promise<UserEntity> {
    this.logger.log(`Executing CreateUserStep for ${data.email}`);

    const newUser = this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: data.email,
      password: hashedPassword,
      phoneNumber: 'N/A', 
      profileImageKey: '',
      status: UserStatus.INACTIVE,
    });

    try {
      const savedUser = await this.userRepository.save(newUser);
      this.logger.log(`User created successfully: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
