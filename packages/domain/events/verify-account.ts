import { Topics } from '../topics';
import { EventModel } from "./event.model";

export interface VerifyAccountEventData {
  token: string;
}

export class VerifyAccountEvent extends EventModel {
  constructor(data: VerifyAccountEventData) {
      super(
          Topics.VERIFY_ACCOUNT,
          data
      )
  }
}
