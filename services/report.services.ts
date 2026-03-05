import type { orderReportsPgRepositoryClass } from "../repositories/report.repository/order.reports.pgrepository.js";
import type { userReportsPgRepositoryClass } from "../repositories/report.repository/user.reports.pgrepository.js";
import { logUtil } from "../utils/log.utils.js";


class reportServicesClass {

    constructor( private userReportMethods : userReportsPgRepositoryClass,private orderReportMethods : orderReportsPgRepositoryClass ) {};

    dailyOrders = async () => {
        const data = await this.orderReportMethods.dailyOrders();
        logUtil.logActivity("Daily orders report generated");
        return data;
    }

    userActivity = async () => {
        const data = await this.userReportMethods.userActivity();
        logUtil.logActivity("User Activity report generated");
        return data;
    }

    productRevenue = async () => {
        const data = await this.orderReportMethods.productsReport();
        logUtil.logActivity("Product specific report generated");
        return data;
    }

    ordersAtDate = async (date: string) => {
        const data = await this.orderReportMethods.ordersAtDate(date);
        logUtil.logActivity(`Orders report for the date : ${date} generated`);
        return data;
    }

    ordersInRange = async (startDate : string, endDate : string) => {
        const data = await this.orderReportMethods.ordersInRange(startDate, endDate);
        logUtil.logActivity(`Orders report in the date range of : start : ${startDate} and end : ${endDate} generated`);
        return data;
    }

}

export { reportServicesClass }