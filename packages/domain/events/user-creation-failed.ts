import { Topics } from "../topics";
import { EventModel } from "./event.model";

export interface UserCreationFailedEventData {
    firstName: string;
    lastName: string;
    emailAddress: string;
    error: string;
}

export class UserCreationFailedEvent extends EventModel {
    constructor(data: UserCreationFailedEventData) {
        super(
            Topics.USER_CREATION_FAILED,
             data
        );
    }
}
