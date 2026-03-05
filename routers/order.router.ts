import express from "express"
import { orderFactory } from "../factory/order.factory.js";
import { errorHandler } from "../factory/utils.factory.js";
import { authMiddleware } from "../factory/auth.factory.js";
import { redisCache } from "../factory/cache.factory.js";

const orderRouter = express.Router();
const orderController = orderFactory.create();

orderRouter.use(authMiddleware.authenticate);
orderRouter.use(redisCache.cacheRequest(Number(process.env.REDIS_TTL_SHORT) ?? 30));

orderRouter.post("/", errorHandler.controllerWrapper(orderController.create));
orderRouter.get("/:id", errorHandler.controllerWrapper(orderController.get));
orderRouter.delete("/", errorHandler.controllerWrapper(orderController.delete));

export { orderRouter }