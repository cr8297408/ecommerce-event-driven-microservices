import { Topics } from "../topics";
import { EventModel } from "./event.model";

export interface CreateUserEventData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export class CreateUserEvent extends EventModel {
    constructor(data: CreateUserEventData) {
        super(
            Topics.CREATE_USER,
            data
        )
    }
}