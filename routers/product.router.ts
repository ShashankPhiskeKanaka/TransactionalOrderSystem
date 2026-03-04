import express from "express"
import { authMiddleware } from "../factory/auth.factory.js";
import { errorHandler } from "../factory/utils.factory.js";
import { productFactory } from "../factory/product.factory.js";

const productRouter = express.Router();
const productController = productFactory.create();

productRouter.get("/:id", errorHandler.controllerWrapper(productController.get));

productRouter.use(authMiddleware.authenticateAdmin);
productRouter.post("/", errorHandler.controllerWrapper(productController.create));
productRouter.patch("/", errorHandler.controllerWrapper(productController.updated));
productRouter.patch("/increment", errorHandler.controllerWrapper(productController.incrementQuantity));
productRouter.patch("/decrement", errorHandler.controllerWrapper(productController.decrementQuantity));
productRouter.delete("/:id", errorHandler.controllerWrapper(productController.delete));

export { productRouter };