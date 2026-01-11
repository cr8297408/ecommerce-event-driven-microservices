import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserEventData, ResendVerificationTokenEvent, Topics, UserCreatedEvent, UserCreationFailedEvent, ValidateEmailAndPasswordEventData, VerifyAccountEventData } from '@ecommerce-event-driven/domain';
import { HashPasswordStep, GenerateVerificationTokenStep, CreateUserStep, FindUserByEmailStep, VerifyPasswordStep, UpdateUserStatusStep } from './steps';
import { UserEntity } from './entities/user.entity';
import { UserStatus } from './enums';
import { JwtService } from '@nestjs/jwt';

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
    private readonly updateUserStatusStep: UpdateUserStatusStep,
    private readonly jwtService: JwtService,
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

  async validateEmailAndPassword(data: ValidateEmailAndPasswordEventData): Promise<{ success: boolean; message: string; user?: UserEntity }> {
    this.logger.log(`🔍 Validando credenciales para: ${data.email}`);
    const user = await this.findUserByEmailStep.execute(data.email);
    if (!user) {
      this.logger.warn(`❌ Usuario no encontrado: ${data.email}`);
      return { success: false, message: 'Invalid credentials' };
    }

    this.logger.log(`👤 Usuario encontrado: ${user.id}. Verificando estado...`);
    
    if (user.status !== UserStatus.ACTIVE) {
       this.logger.warn(`⚠️ Usuario inactivo: ${user.id} (${user.status})`);
       return { success: false, message: 'Email is not active' };
    }

    this.logger.log(`🔑 Verificando contraseña para: ${user.id}...`);
    const isPasswordValid = await this.verifyPasswordStep.execute(data.password, user.password);

    if (!isPasswordValid) {
        this.logger.warn(`⛔ Contraseña inválida para: ${user.id}`);
        return { success: false, message: 'Invalid credentials' };
    }

    this.logger.log(`✅ Credenciales válidas y usuario activo: ${user.id}`);
    return { success: true, message: 'Login successful', user };
  }
  async verifyAccount(data: VerifyAccountEventData) {
    this.logger.log(`🔍 Verifying account with token...`);
    
    try {
        const decoded = this.jwtService.verify(data.token);
        const email = decoded.email;
        this.logger.log(`📧 Token valid for email: ${email}`);

        const user = await this.findUserByEmailStep.execute(email);
        if (!user) {
             this.logger.warn(`❌ User not found for email from token: ${email}`);
             return { success: false, message: 'User not found' };
        }

        if (user.status === UserStatus.ACTIVE) {
             this.logger.log(`ℹ️ User already active: ${email}`);
             return { success: true, message: 'Account already active' };
        }

        await this.updateUserStatusStep.execute(user.id, UserStatus.ACTIVE);
        this.logger.log(`✅ Account activated for: ${email}`);

        return { success: true, message: 'Account verified successfully' };

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
             this.logger.warn(`⚠️ Token expired. Attempting to resend to user.`);
             const decoded = this.jwtService.decode(data.token) as { email: string; [key: string]: any };
             if (decoded && decoded.email) {
                 this.logger.log(`📧 Regenerating token for: ${decoded.email}`);
                 const newToken = this.generateTokenStep.execute(decoded.email);
                 
                 const resendEvent = new ResendVerificationTokenEvent({
                    email: decoded.email,
                    token: newToken,
                 });
                 this.kafkaClient.emit(resendEvent.topic, resendEvent.data);
                 this.logger.log(`📤 Resent verification token event emitted for: ${decoded.email}`);
                 return { success: false, message: 'Token expired. A new verification email has been sent.' };
             }
        }
        this.logger.error(`❌ Token verification failed: ${error.message}`);
        return { success: false, message: 'Invalid or expired token' };
    }
  }
}
