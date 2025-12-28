import { MicroserviceClass } from "./microservice.model";

export const InventoryMicroservice: MicroserviceClass = {
    id: "service-inventory-id",
    name: "INVENTORY_SERVICE",
    clientId: "inventory",
} as const;