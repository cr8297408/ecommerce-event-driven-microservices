import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Kafka Configuration
  KAFKA_BROKERS: Joi.string().required(),

  // Database Configuration
  POSTGRES_DB_HOST: Joi.string().required(),
  POSTGRES_DB_PORT: Joi.number().default(5432),
  POSTGRES_DB_USERNAME: Joi.string().required(),
  POSTGRES_DB_PASSWORD: Joi.string().required(),
  POSTGRES_DB_NAME: Joi.string().required(),
});
