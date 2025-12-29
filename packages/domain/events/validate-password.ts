import { Topics } from "../topics";
import { EventModel } from "./event.model";

export interface ValidateEmailAndPasswordEventData {
    email: string;
    password: string;
}

export class ValidateEmailAndPasswordEvent extends EventModel {
    constructor(data: ValidateEmailAndPasswordEventData) {
            super(
                Topics.VALIDATE_EMAIL_AND_PASSWORD,
                data
            )
        }
}