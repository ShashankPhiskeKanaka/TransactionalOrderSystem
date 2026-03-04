import { orderControllerClass } from "../controllers/order.controller.js";
import { orderPgRepositoryClass } from "../repositories/order.repository/order.pgrepository.js";
import { orderServicesClass } from "../services/order.services.js";

class orderFactory {
    static create () {
        const repo = new orderPgRepositoryClass();
        const service = new orderServicesClass(repo);
        const controller = new orderControllerClass(service);

        return controller
    }
}

export { orderFactory }