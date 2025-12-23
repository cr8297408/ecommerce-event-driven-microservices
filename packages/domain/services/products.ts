import { MicroserviceModel } from "./microservice.model";

export class ProductsMicroservice implements MicroserviceModel {
    id = "service-products-id";
    name = "PRODUCTS_SERVICE"
    clientId = "product";
    consumerId = 'product-consumer';
}