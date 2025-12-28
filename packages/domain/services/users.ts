import { MicroserviceClass } from "./microservice.model";

export const UsersMicroservice: MicroserviceClass = {
    id: "service-users-id",
    name: "USERS_SERVICE",
    clientId: "users",
} as const;
