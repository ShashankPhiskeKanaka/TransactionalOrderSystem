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

        res.setHeader('Content-type' , 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        res.write("Data connected to the stream \n\n");

        const interval = setInterval(async () => {
            const data = await this.reportService.productRevenue();

            const payload = JSON.stringify({
                success : true,
                message : "Products report generated",
                data : data
            })

            res.write(`data: ${payload} \n\n`)
        }, 2000);

        req.on("close", () => {
            clearInterval(interval);
            res.send();
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