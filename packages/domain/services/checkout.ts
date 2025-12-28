import { MicroserviceClass } from "./microservice.model";

export const CheckoutMicroservice: MicroserviceClass = {
    id: "service-checkout-id",
    name: "CHECKOUT_SERVICE",
    clientId: "checkout",
} as const;