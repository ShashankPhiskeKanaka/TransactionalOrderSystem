import type { NextFunction, Request, Response } from "express"
import { logUtil, type logError } from "./log.utils.js";

class errorHandlerClass {
    controllerWrapper = (fn : any) => {
        return ( req: Request, res: Response, next: NextFunction ) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        }
    }
}

class globalErrorHandlerClass {
    handleError = ( err: any, req: Request, res: Response, next: NextFunction ) => {
        logUtil.logError({ status: err.status ?? 500, message : err.message });

        return res.status(err.status ?? 500).json({
            success : false,
            message : err.message
        });
    }
}

class serverError extends Error {
    public status : number;
    constructor ( errorData : logError ) {
        super(errorData.message);
        this.status = errorData.status;
        this.message = errorData.message;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export { errorHandlerClass, globalErrorHandlerClass, serverError }