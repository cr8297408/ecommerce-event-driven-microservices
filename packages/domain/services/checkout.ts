import { MicroserviceModel } from "./microservice.model";

export class CheckoutMicroservice extends MicroserviceModel {
    constructor() {
        super(
            "service-checkout-id",       // id
            "CHECKOUT_SERVICE",          // name
            "checkout-consumer",         // consumerId
            "checkout"                   // clientId
        );
    }
}