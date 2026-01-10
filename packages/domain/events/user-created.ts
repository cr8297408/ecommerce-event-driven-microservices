import { Topics } from "../topics";
import { EventModel } from "./event.model";

export interface UserCreatedEventData {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    profileImageKey: string;
    verificationToken: string;
    status: string;
    createdAt: Date;
}

export class UserCreatedEvent extends EventModel {
    constructor(data: UserCreatedEventData) {
        super(
            Topics.USER_CREATED,
             data
        );
    }
}