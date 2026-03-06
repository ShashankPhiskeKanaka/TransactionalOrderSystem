import type { NextFunction, Request, Response } from "express"
import { redisUtils } from "../factory/utils.factory.js";
import { logUtil } from "../utils/log.utils.js";
import { serverError } from "../utils/error.utils.js";
import { client } from "../caching/redis.client.js";

/**
 * Implements the idempotency middleware
 * 
 */
class IdempotencyMiddlewareClass {

    constructor ( private redisClient : any ) {};

    handle = (ttl : number) => {
        return async (req : Request, res : Response, next : NextFunction) => {
            // extract the req header of idempotency key
            const key = req.headers['idempotency-key'] as string;
            // if it is a get method skip the process
            if(req.method == 'GET') return next();
            // enforce idempotency keys for all other routes
            if(!key) {
                return res.status(400).json({
                    error : "Invalid request"
                });
            }

            // generating keys for storage in redis, it will use the idempotency key from the header along with a "idem" prefix
            const redisKey = `idem:${key}`;

            // generate hashed data for req.body, req.originalUrl and req.method
            const requestHash = redisUtils.generatePayloadHash(req);

            try {

                // checks if there is a cached data available with the key
                const cached = await this.redisClient.get(redisKey);
                // if data available then start the replay logic
                if(cached) {

                    // extract the cached data
                    const { status, body, hash, state } = JSON.parse(cached);
                    // if the hash doesnt match the created hash for req
                    if(hash != requestHash) {
                        return res.status(422).json({
                            error : "Idempotency key reused"
                        });
                    }
                    
                    // log the replay activity
                    logUtil.logActivity(`Idempotency "Replay" for key : ${key}`);
                    // return the cached body
                    return res.status(status).set('X-Idempotency-Replay', 'true').json(body);

                }

                // sets the keys, nx here specifies only set the keys if it doesnt already exist
                // this creates a lock for 5 min, if 2 requests hit 2 different servers at the same exact millisecond then redis ensures that only one succeeds in setting this lock
                const locked = await this.redisClient.set(redisKey, JSON.stringify({ state : 'STARTED', hash : requestHash }), 'EX', 300, 'NX');
                if(!locked) return res.status(409).json({
                    error : "Request in process"
                });

                // we hijack the response from the controller which sends the response ( in controller res.json )
                // we set the key and value in redis if success and delete if server error
                const originalJson = res.json.bind(res);

                res.json = (body : any) : Response => {
                    if(res.statusCode < 500) {
                        const responsePayload = { state : "COMPLETED", hash : requestHash, status : res.statusCode, body };
                        this.redisClient.set(redisKey, JSON.stringify(responsePayload), 'EX', 300);
                    }else{
                        this.redisClient.del(redisKey);
                    }

                    return originalJson(body);
                }

                next();
            }
            catch (err : any) {
                next(new serverError(err));
            }
        }
    }
}

const idempotency = new IdempotencyMiddlewareClass(client);
const idempotencyMiddleware = idempotency.handle(Number(process.env.REDIS_TTL_LONG) ?? 86400);

export { idempotencyMiddleware }