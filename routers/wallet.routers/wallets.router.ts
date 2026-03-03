import express from "express"
import { walletFactory } from "../../factory/wallet.factory.js";
import { errorHandler } from "../../factory/utils.factory.js";
import { validate } from "../../middlewares/zod.validate.js";
import { fetchWalletSchema } from "../../schemas/wallet.schema.js";
import { authMiddleware } from "../../factory/auth.factory.js";

const walletsRouter = express.Router();
const walletController = walletFactory.create();

walletsRouter.use(authMiddleware.authenticateAdmin);

walletsRouter.get("/", errorHandler.controllerWrapper(walletController.get));

export { walletsRouter }