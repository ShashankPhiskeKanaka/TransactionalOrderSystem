import type { Request, Response } from "express";
import type { productServicesClass } from "../services/product.services.js";
import { responseMessages } from "../constants/response.messages.js";

const responseMessage = new responseMessages("Product");

class productControllerClass {
    constructor ( private productService : productServicesClass ) {};

    create = async ( req: Request, res : Response ) => {
        const product = await this.productService.create(req.body);
        return res.json({
            success : true,
            message : responseMessage.CREATED,
            data : product
        });
    }

    get = async ( req: Request, res : Response ) => {
        const product = await this.productService.get(req.params.id?.toString() ?? "");
        return res.json({
            success : true,
            message : responseMessage.FETCHED,
            data : product
        });
    }
    getAll = async ( req: Request, res : Response ) => {
        const product = await this.productService.getAll();
        return res.json({
            success : true,
            message : responseMessage.FETCHED,
            data : product
        });
    }
    updated = async ( req: Request, res : Response ) => {
        const product = await this.productService.update(req.body);
        return res.json({
            success : true,
            message : responseMessage.UPDATED,
            data : product
        });
    }
    incrementQuantity = async ( req: Request, res : Response ) => {
        const product = await this.productService.incrementQuantity(req.body);
        return res.json({
            success : true,
            message : responseMessage.UPDATED,
            data : product
        });
    }
    decrementQuantity = async ( req: Request, res : Response ) => {
        const product = await this.productService.decrementQuantity(req.body);
        return res.json({
            success : true,
            message : responseMessage.UPDATED,
            data : product
        });
    }   

    delete = async ( req : Request, res : Response ) => {
        const product = await this.productService.delete(req.params.id?.toString() ?? "");
        return res.json({
            success : true,
            message : responseMessage.DELETED,
            data : product
        });     
    }
}

export { productControllerClass };