import { pool } from "../../db/pg.pool.js"
import { prisma } from "../../db/prisma.js";

class orderReportsPgRepositoryClass {
    dailyOrders = async ( ) : Promise<any> => {
        const res = await pool.query(
            `
                EXPLAIN ANALYZE
                SELECT
                    o.id as "orderId",
                    o."createdAt" as "orderedAt",
                    COALESCE(SUM(oi.quantity * oi."purchasedPrice"), 0) AS "orderValue"
                FROM orders o
                LEFT JOIN "orderItems" oi ON oi."orderId" = o.id
                WHERE o."deletedAt" IS NULL
                GROUP BY o.id
                ORDER BY "orderValue" DESC;
            `
        );

        return res.rows
    }

    ordersAtDate = async (targetDate : any) : Promise<any> => {
        const data = await prisma.$queryRaw`
        SELECT 
            o.id AS "orderId",
            o."userId",
            u.name AS "userName",
            SUM(oi.quantity * oi."purchasedPrice") AS "totalValue",
            o."createdAt"
        FROM "orders" o
        JOIN "users" u ON u.id = o."userId"
        JOIN "orderItems" oi ON oi."orderId" = o.id
        WHERE o."deletedAt" IS NULL
            AND DATE(o."createdAt") = ${targetDate}
        GROUP BY o.id, o."userId", u.name, o."createdAt"
        ORDER BY "totalValue" DESC;
        `;

        return data;
    }

    ordersInRange = async (startDate: any, endDate: any) : Promise<any> => {
        const ordersInRange = await prisma.$queryRaw`
        EXPLAIN ANALYZE
        SELECT 
            o.id AS "orderId",
            o."userId",
            u.name AS "userName",
            SUM(oi.quantity * oi."purchasedPrice") AS "totalValue",
            o."createdAt"
        FROM "orders" o
        JOIN "users" u ON u.id = o."userId"
        JOIN "orderItems" oi ON oi."orderId" = o.id
        WHERE o."deletedAt" IS NULL
            AND o."createdAt" >= ${startDate}
            AND o."createdAt" < ${endDate}
        GROUP BY o.id, o."userId", u.name, o."createdAt"
        ORDER BY o."createdAt" ASC;
        `;

        return ordersInRange
    }

    productsReport = async () : Promise<any> => {
        const productRevenue = await prisma.$queryRaw`
            EXPLAIN ANALYZE
            SELECT
                p.id AS "productId",
                p.name AS "productName",
                p.stock AS "currentStock",
                COALESCE(SUM(oi.quantity)::DOUBLE PRECISION, 0) AS "totalUnitsSold",
                COALESCE(SUM(oi.quantity * oi."purchasedPrice")::DOUBLE PRECISION, 0) AS "totalRevenue"
            FROM "products" p
            LEFT JOIN "orderItems" oi ON oi."productId" = p.id
            LEFT JOIN "orders" o ON o.id = oi."orderId" AND o."deletedAt" IS NULL
            WHERE p."deletedAt" IS NULL
            GROUP BY p.id, p.name, p.stock
            ORDER BY "totalRevenue" DESC;
        `;

        return productRevenue;
    }
}

export { orderReportsPgRepositoryClass }