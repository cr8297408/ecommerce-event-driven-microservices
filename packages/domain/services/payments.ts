import { MicroserviceModel } from "./microservice.model";

export class PaymentsMicroservice implements MicroserviceModel {
    id = "service-payments-id";
    name = "PAYMENTS_SERVICE"
    clientId = "payments";
    consumerId = 'payments-consumer';
}