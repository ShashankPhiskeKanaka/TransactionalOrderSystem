import { reportControllerClass } from "../controllers/report.controller.js";
import { reportPgRepositoryClass } from "../repositories/report.repository/report.pgrepository.js";
import { reportServicesClass } from "../services/report.services.js";

class reportFactory {
    static create () {
        const repo = new reportPgRepositoryClass();
        const service = new reportServicesClass(repo);
        const controller = new reportControllerClass(service);

        return controller;
    }
}

export { reportFactory };