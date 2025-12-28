import { MicroserviceClass } from "./microservice.model";

export const ProductsMicroservice: MicroserviceClass = {
    id: "service-products-id",
    name: "PRODUCTS_SERVICE",
    clientId: "products",
} as const;