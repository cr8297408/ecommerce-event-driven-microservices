import * as Joi from 'joi';

export const ValidateEmailAndPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
