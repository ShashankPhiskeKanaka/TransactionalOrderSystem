import { reportControllerClass } from "../controllers/report.controller.js";
import { orderReportsPgRepositoryClass } from "../repositories/report.repository/order.reports.pgrepository.js";
import { userReportsPgRepositoryClass } from "../repositories/report.repository/user.reports.pgrepository.js";
import { reportServicesClass } from "../services/report.services.js";

class reportFactory {
    static create () {
        const user = new userReportsPgRepositoryClass();
        const order = new orderReportsPgRepositoryClass();
        const service = new reportServicesClass(user, order);
        const controller = new reportControllerClass(service);

        return controller;
    }
}

export { reportFactory };