import { MicroserviceModel } from "./microservice.model";

export class InventoryMicroservice extends MicroserviceModel {
    constructor() {
        super(
            "service-inventory-id",
            "INVENTORY_SERVICE",
            "inventory-consumer",
            "inventory"
        );
    }
}