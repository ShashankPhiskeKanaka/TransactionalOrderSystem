import express from "express"
import { orderFactory } from "../factory/order.factory.js";
import { errorHandler } from "../factory/utils.factory.js";
import { authMiddleware } from "../factory/auth.factory.js";
import { redisCache } from "../factory/cache.factory.js";
import { idempotencyMiddleware } from "../middlewares/idempotency.middleware.js";

const orderRouter = express.Router();
const orderController = orderFactory.create();

orderRouter.use(authMiddleware.authenticate);
orderRouter.use(redisCache.cacheRequest(Number(process.env.REDIS_TTL_SHORT) ?? 30));


orderRouter.get("/:id", errorHandler.controllerWrapper(orderController.get));
orderRouter.delete("/", errorHandler.controllerWrapper(orderController.delete));

orderRouter.use(idempotencyMiddleware);
orderRouter.post("/", errorHandler.controllerWrapper(orderController.create));

export { orderRouter }