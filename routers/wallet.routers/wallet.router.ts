import express from "express"
import { walletFactory } from "../../factory/wallet.factory.js";
import { errorHandler } from "../../factory/utils.factory.js";
import { validate } from "../../middlewares/zod.validate.js";
import { fetchWalletSchema } from "../../schemas/wallet.schema.js";
import { authMiddleware } from "../../factory/auth.factory.js";
import { idempotencyMiddleware } from "../../middlewares/idempotency.middleware.js";

const walletRouter = express.Router();
const walletController = walletFactory.create();

walletRouter.use(authMiddleware.authenticate);

walletRouter.post("/", errorHandler.controllerWrapper(validate(fetchWalletSchema)), errorHandler.controllerWrapper(walletController.get));

walletRouter.use(idempotencyMiddleware);
walletRouter.patch("/increment", errorHandler.controllerWrapper(walletController.incrementBalance));
walletRouter.patch("/decrement", errorHandler.controllerWrapper(walletController.decrementBalance));

export { walletRouter }