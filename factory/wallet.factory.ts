import { walletControllerClass } from "../controllers/wallet.controller.js";
import { walletPgRepositoryClass } from "../repositories/wallet.repository/wallet.pgrepository.js";
import { walletServicesClass } from "../services/wallet.services.js";

class walletFactory {
    static create () {
        const repo = new walletPgRepositoryClass();
        const service = new walletServicesClass(repo);
        const controller = new walletControllerClass(service);

        return controller;
    }
}

export { walletFactory }