import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { logUtil } from "../utils/log.utils.js";
import { errorMessage } from "../constants/error.messages.js";

const validate = ( schema : z.ZodTypeAny ) => {
    return (req: Request, res : Response, next: NextFunction) => {
        const result = schema.safeParse({
            body : req.body,
            cookies: req.cookies,
            params: req.params,
            query: req.query
        });

        if(!result.success) {
            logUtil.logError(errorMessage.INVALIDDATA);

            return res.status(errorMessage.INVALIDDATA.status).json({
                success : false,
                message : errorMessage.INVALIDDATA.message
            });
        }

        next();
    }
}

export { validate };