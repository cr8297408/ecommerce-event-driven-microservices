import { Topics } from "../topics";
import { EventModel } from "./event.model";

export interface CreateUserEventData {
    name: string;
    email: string;
    password: number;
}

export class CreateUserEvent extends EventModel {
    constructor(data: CreateUserEventData) {
        super(
            Topics.CREATE_USER,
            data
        )
    }
}