import { pool } from "../../db/pg.pool.js"

class userReportsPgRepositoryClass {
    userActivity = async () : Promise<any> => {
        const res = await pool.query(
            `   EXPLAIN ANALYZE
                SELECT
                    u.id as "userId",
                    u.name as name,
                    COUNT(DISTINCT o.id) AS "totalOrders",
                    COALESCE (SUM(oi.quantity * oi."purchasedPrice"), 0) AS "totalAmountSpent"
                FROM users u
                LEFT JOIN orders o ON o."userId" = u.id
                LEFT JOIN "orderItems" oi ON oi."orderId" = o.id
                GROUP BY u.id, u.name
                ORDER BY "totalAmountSpent" DESC;
            `
        )

        return res.rows
    }
}

export { userReportsPgRepositoryClass }