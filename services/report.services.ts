import type { orderReportsPgRepositoryClass } from "../repositories/report.repository/order.reports.pgrepository.js";
import type { userReportsPgRepositoryClass } from "../repositories/report.repository/user.reports.pgrepository.js";


class reportServicesClass {

    constructor( private userReportMethods : userReportsPgRepositoryClass,private orderReportMethods : orderReportsPgRepositoryClass ) {};

    dailyOrders = async () => {
        const data = await this.orderReportMethods.dailyOrders();
        return data;
    }

    userActivity = async () => {
        const data = await this.userReportMethods.userActivity();
        return data;
    }

    productRevenue = async () => {
        const data = await this.orderReportMethods.productsReport();
        return data;
    }

    ordersAtDate = async (date: string) => {
        const data = await this.orderReportMethods.ordersAtDate(date);
        return data;
    }

    ordersInRange = async (startDate : string, endDate : string) => {
        const data = await this.orderReportMethods.ordersInRange(startDate, endDate);
        return data;
    }

}

export { reportServicesClass }