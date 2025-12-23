import { MicroserviceModel } from "./microservice.model";

export class ProductsMicroservice extends MicroserviceModel {
    constructor() {
        super(
            "service-products-id",       // id
            "PRODUCTS_SERVICE",          // name
            "product-consumer",          // consumerId
            "product"                    // clientId
        );
    }
}