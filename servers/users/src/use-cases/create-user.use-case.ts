
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CreateUserEventData } from '@ecommerce-event-driven/domain';
import { UserStatus } from '../enums';
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(data: CreateUserEventData): Promise<UserEntity> {
    this.logger.log(`Executing CreateUserUseCase with data: ${JSON.stringify(data)}`);

    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(data.password, salt, 64)) as Buffer;
    const hashedPassword = `${salt}:${derivedKey.toString('hex')}`;

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
