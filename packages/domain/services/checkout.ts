import { MicroserviceModel } from "./microservice.model";

export class CheckoutMicroservice implements MicroserviceModel {
    id = "service-checkout-id";
    name = "CHECKOUT_SERVICE"
    clientId = "checkout";
    consumerId = 'checkout-consumer';
}