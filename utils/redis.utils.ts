import type { Request } from "express";
import { client } from "../caching/redis.client.js";
import { serverError } from "./error.utils.js";
import { logUtil } from "./log.utils.js";

class redisUtilsClass {
    generateKey = ( req: Request ) => {
        const userId = req.user?.id || 'public';
        const resource = req.baseUrl.split("/").pop() || 'global';

        const sortedQuery = Object.keys(req.query).sort().map(key => `${key.toLowerCase()}=${String(req.query[key]).toLowerCase()}`)
        .join('&');

        const path = req.path.replace(/\/$/, "");

        return `v1:cache:${userId}:${resource}:${path}${sortedQuery ? "?" + sortedQuery : ""}`;
    }

    invalidateKey = async ( userId: string, resource: string ) => {

        const pattern = `v1:cache:${userId}:${resource}:*`

        try{
            if(!pattern.includes("*")){
                await client.del(pattern);
                return;
            }

            const keys: string[] = [];

            for await (const key of client.scanIterator({
                MATCH : pattern,
                COUNT : 100
            })) {
                keys.push(...key);
            }
            if(keys.length > 0) {
                await client.del(keys);
            }
            logUtil.logActivity("Orders cache cleared");
        }catch (err : any) {
            throw new serverError(err);
        }
    }

}

export { redisUtilsClass }