import { MicroserviceModel } from "./microservice.model";

export class PaymentsMicroservice extends MicroserviceModel {
    constructor() {
        super(
            "service-payments-id",       // id
            "PAYMENTS_SERVICE",          // name
            "payments-consumer",         // consumerId
            "payments"                   // clientId
        );
    }
}