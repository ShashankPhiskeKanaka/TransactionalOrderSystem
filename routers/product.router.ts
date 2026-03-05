import express from "express"
import { authMiddleware } from "../factory/auth.factory.js";
import { errorHandler } from "../factory/utils.factory.js";
import { productFactory } from "../factory/product.factory.js";
import { redisCache } from "../factory/cache.factory.js";
import { cacheTtl } from "../constants/cache.ttl.js";

const productRouter = express.Router();
const productController = productFactory.create();

productRouter.use(redisCache.cacheRequest(cacheTtl.SHORT));
productRouter.get("/:id", redisCache.cacheRequest, errorHandler.controllerWrapper(productController.get));

productRouter.use(authMiddleware.authenticateAdmin);
productRouter.use(redisCache.cacheRequest(cacheTtl.MEDIUM));

productRouter.post("/", errorHandler.controllerWrapper(productController.create));
productRouter.patch("/", errorHandler.controllerWrapper(productController.updated));
productRouter.patch("/increment", errorHandler.controllerWrapper(productController.incrementQuantity));
productRouter.patch("/decrement", errorHandler.controllerWrapper(productController.decrementQuantity));
productRouter.delete("/:id", errorHandler.controllerWrapper(productController.delete));

export { productRouter };