import type { Request, Response, NextFunction } from "express";

const logger = (req : Request, res : Response, next : NextFunction) => {
    // generates a start timestamp
    const start = Date.now();
    // waits till the request execution is done and then runs this module
    res.on("finish", () =>{
        // calculates the execution time by comparing start time with current timestamp
        const duration = Date.now() - start;
        // logs the request methods, url and execution duration
        console.log(`${req.method} ${req.originalUrl} - duration : ${duration} ms`);
        console.log();
    });
    // forwards the request
    next();
}

export { logger }