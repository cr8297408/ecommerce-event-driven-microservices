import * as Joi from 'joi';
import { VerifyAccountEventData } from '@ecommerce-event-driven/domain';

export const VerifyAccountSchema = Joi.object<VerifyAccountEventData>({
  token: Joi.string().required(),
});
