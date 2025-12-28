import { MicroserviceClass } from "./microservice.model";

export const PaymentsMicroservice: MicroserviceClass = {
    id: "service-payments-id",
    name: "PAYMENTS_SERVICE",
    clientId: "payments",
} as const;