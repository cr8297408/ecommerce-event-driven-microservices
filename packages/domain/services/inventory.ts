import { MicroserviceModel } from "./microservice.model";

export class InventoryMicroservice implements MicroserviceModel {
    id = "service-inventory-id";
    name = "INVENTORY_SERVICE"
    clientId = "inventory";
    consumerId = 'inventory-consumer';
}