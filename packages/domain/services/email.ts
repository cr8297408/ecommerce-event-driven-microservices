import { MicroserviceClass } from "./microservice.model";

export const EmailMicroservice: MicroserviceClass = {
    id: "service-email-id",
    name: "EMAIL_SERVICE",
    clientId: "email",
} as const;