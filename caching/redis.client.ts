import { createClient } from "redis";
import { serverError } from "../utils/error.utils.js";
import { logUtil } from "../utils/log.utils.js";
import dotenv from "dotenv"
dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL || ""
});

client.on("error", (err) => {
    console.log(err);
});

await client.connect();
logUtil.logActivity("Redis connected");

export { client }