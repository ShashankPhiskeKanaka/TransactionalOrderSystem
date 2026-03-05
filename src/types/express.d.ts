import { Request } from "express";
import * as express from "express-server-static-core"


// these are called declaration merging
declare global{
    namespace Express {
        interface Request {
            user : {
                id: string,
                role: string
            }
        }
    }
}

declare module 'express-serve-static-core' {
    interface Response {
        sendResponse?: (body: any) => Response;
    }
}