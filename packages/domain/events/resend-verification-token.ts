import { Topics } from '../topics';
import { EventModel } from "./event.model";

export interface ResendVerificationTokenEventData {
  email: string;
  token: string;
}

export class ResendVerificationTokenEvent extends EventModel {
  constructor(data: ResendVerificationTokenEventData) {
      super(
          Topics.RESEND_VERIFICATION_TOKEN,
          data
      )
  }
}
