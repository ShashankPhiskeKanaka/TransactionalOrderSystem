import { Pool } from "pg"
import { logUtil } from "../utils/log.utils.js";

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis : 30000
});

pool.on('error', (err) => {
    logUtil.logError({ status : 500, message : `Unexpected error on idle client : ${err}` });
});

export { pool }