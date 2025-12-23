import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // Kafka Configuration
  KAFKA_BROKERS: Joi.string().required(),

  // JWT/Auth
  JWT_SECRET: Joi.string().optional(),
  JWT_EXPIRATION: Joi.string().default('1d'),
});
