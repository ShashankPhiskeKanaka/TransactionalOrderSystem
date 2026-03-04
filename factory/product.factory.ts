import { productControllerClass } from "../controllers/product.controller.js";
import { productPgRepositoryClass } from "../repositories/product.repository/product.pgrepository.js";
import { productServicesClass } from "../services/product.services.js";

class productFactory {
    static create () {
        const repo = new productPgRepositoryClass();
        const service = new productServicesClass(repo);
        const controller = new productControllerClass(service);

        return controller;
    }
}

export { productFactory }