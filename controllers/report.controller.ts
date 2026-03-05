import type { Request, Response } from "express";
import type { reportServicesClass } from "../services/report.services.js";

class reportControllerClass {
    constructor ( private reportService : reportServicesClass ) {} ;

    userActivity = async ( req : Request, res : Response ) => {
        const data = await this.reportService.userActivity();
        return res.json({
            success : true,
            message : "All users activity report generated",
            data : data
        });
    }

    dailyOrders = async ( req: Request, res: Response ) => {
        const data = await this.reportService.dailyOrders();
        return res.json({
            success : true,
            message : "Daily orders report generated",
            data : data
        })
    }

    productReport = async ( req: Request, res: Response ) => {
        const data = await this.reportService.productRevenue();
        return res.json({
            success : true,
            message : "Products report generated",
            data : data
        })
    }

    ordersAtDate = async ( req: Request, res: Response ) => {
        const data = await this.reportService.ordersAtDate(req.params.date?.toString() ?? "");
        return res.json({
            success : true,
            message : "Daily orders report generated",
            data : data
        })
    }

    ordersInRange = async ( req: Request, res: Response ) => {
        console.log(req.query.start);
        const data = await this.reportService.ordersInRange(req.query.start?.toString() ?? "", req.query.end?.toString() ?? "");
        return res.json({
            success : true,
            message : "Daily orders report generated",
            data : data
        })
    }
}

export { reportControllerClass }