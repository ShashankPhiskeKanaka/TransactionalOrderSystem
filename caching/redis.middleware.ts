import type { NextFunction, Request, Response } from "express";
import { logUtil } from "../utils/log.utils.js";
import { serverError } from "../utils/error.utils.js";
import { redisUtils } from "../factory/utils.factory.js";

class cacheMiddlewareClass {
    constructor ( private cacheClient : any ) {}

    cacheRequest = (ttl : number) => {
        return async (req : Request, res: Response, next: NextFunction) => {
            if (req.method !== "GET") {
                return next();
            }
            const key = redisUtils.generateKey(req);

            try {
                const cachedResponse = await this.cacheClient.get(key);

                if (cachedResponse) {
                    logUtil.logActivity(`Cache "Hit" for key: ${key}`);
                    return res.json(JSON.parse(cachedResponse));
                }

                logUtil.logActivity(`Cache "Miss" for key: ${key}`);

                // 2. Intercept res.json
                const originalJson = res.json.bind(res);

                res.json = (body: any): Response => {
                    // Set the cache and continue with original response
                    this.cacheClient.setEx(key, ttl, JSON.stringify(body));
                    return originalJson(body);
                };

                next();
            } catch (err: any) {
                // 3. CRITICAL: Pass error to next() to prevent spinning
                next(new serverError(err));
            }
        }
    }
}

export { cacheMiddlewareClass }