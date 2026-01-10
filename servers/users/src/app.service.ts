import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserEventData, Topics, UserCreatedEvent, UserCreationFailedEvent, ValidateEmailAndPasswordEventData } from '@ecommerce-event-driven/domain';
import { HashPasswordStep, GenerateVerificationTokenStep, CreateUserStep, FindUserByEmailStep, VerifyPasswordStep } from './steps';
import { UserEntity } from './entities/user.entity';
import { UserStatus } from './enums';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly hashPasswordStep: HashPasswordStep,
    private readonly generateTokenStep: GenerateVerificationTokenStep,
    private readonly createUserStep: CreateUserStep,
    private readonly findUserByEmailStep: FindUserByEmailStep,
    private readonly verifyPasswordStep: VerifyPasswordStep,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(Topics.CREATE_USER);
    await this.kafkaClient.connect();
  }

  async createUser(data: CreateUserEventData) {
    try {
      // Step 1: Hash Password
      const hashedPassword = await this.hashPasswordStep.execute(data.password);

      // Step 2: Generate Verification Token (JWT)
      const token = this.generateTokenStep.execute(data.email);

      // Step 3: Create User (Without token persistence)
      const user = await this.createUserStep.execute(data, hashedPassword);

      const userCreatedEvent = new UserCreatedEvent({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        phoneNumber: user.phoneNumber,
        profileImageKey: user.profileImageKey,
        status: user.status,
        createdAt: user.createdAt,
        verificationToken: token, // Pass stateless token to event
      });

      this.logger.log(`📤 Emitting UserCreatedEvent: ${JSON.stringify(userCreatedEvent.data)}`);
      this.kafkaClient.emit(userCreatedEvent.topic, userCreatedEvent.data);
    } catch (error) {
       this.logger.error(`Error processing user creation: ${error.message}`);
       const userCreationFailedEvent = new UserCreationFailedEvent({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        error: error.message,
      });
      this.logger.log(`📤 Emitting UserCreationFailedEvent: ${JSON.stringify(userCreationFailedEvent.data)}`);
      this.kafkaClient.emit(userCreationFailedEvent.topic, userCreationFailedEvent.data);
      throw error;
    }
  }

  async validateEmailAndPassword(data: ValidateEmailAndPasswordEventData): Promise<{ isValid: boolean; emailIsActive: boolean; user?: UserEntity }> {
    this.logger.log(`🔍 Validando credenciales para: ${data.email}`);
    const user = await this.findUserByEmailStep.execute(data.email);
    if (!user) {
      this.logger.warn(`❌ Usuario no encontrado: ${data.email}`);
      return { isValid: false, emailIsActive: false };
    }

    this.logger.log(`👤 Usuario encontrado: ${user.id}. Verificando estado...`);
    const emailIsActive = user.status === UserStatus.ACTIVE;
    
    if (!emailIsActive) {
       this.logger.warn(`⚠️ Usuario inactivo: ${user.id} (${user.status})`);
    }

    this.logger.log(`🔑 Verificando contraseña para: ${user.id}...`);
    const isPasswordValid = await this.verifyPasswordStep.execute(data.password, user.password);

    if (isPasswordValid && emailIsActive) {
      this.logger.log(`✅ Credenciales válidas y usuario activo: ${user.id}`);
      return { isValid: true, emailIsActive: true, user };
    }

    if (!isPasswordValid) {
        this.logger.warn(`⛔ Contraseña inválida para: ${user.id}`);
    }

    return { isValid: isPasswordValid, emailIsActive };
  }
}
