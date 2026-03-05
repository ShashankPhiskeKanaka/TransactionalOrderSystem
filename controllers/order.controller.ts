import { responseMessages } from "../constants/response.messages.js";
import type { orderServicesClass } from "../services/order.services.js";
import type { Request, Response } from "express";
import { logUtil } from "../utils/log.utils.js";
import { redisUtils } from "../factory/utils.factory.js";

const responseMessage = new responseMessages("Order");

class orderControllerClass {
    constructor ( private orderService : orderServicesClass ) {};

    create = async ( req: Request, res : Response ) => {
        const order = await this.orderService.create(req.body, req.user);

        await redisUtils.invalidateKey(req.user.id, "order");

        return res.json({
            success : true,
            message : responseMessage.CREATED,
            data : order
        });
    }

    delete = async ( req: Request, res : Response ) => {
        const order = await this.orderService.delete(req.params.id?.toString() ?? "", req.user);

        await redisUtils.invalidateKey(req.user.id, "order");

        return res.json({
            success : true,
            message : responseMessage.DELETED,
            data : order
        });
    }

    get = async ( req: Request, res : Response ) => {
        const order = await this.orderService.get(req.params.id?.toString() ?? "", req.user);
        return res.json({
            success : true,
            message : responseMessage.FETCHED,
            data : order
        });
    }
}

export { orderControllerClass }