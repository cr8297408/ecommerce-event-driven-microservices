import { Topics } from "../topics";
import { EventModel } from "./event.model";

export interface CreateProductEventData {
    id: string;
    name: string;
    description: string;
    price: number;
}

export class CreateProductEvent extends EventModel {
    constructor(data: CreateProductEventData) {
        super(
            Topics.CREATE_PRODUCT,
            data
        )
    }
}