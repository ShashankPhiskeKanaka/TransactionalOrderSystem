import express from "express"
import { userFactory } from "../../factory/user.factory.js";
import { errorHandler } from "../../factory/utils.factory.js";
import { validate } from "../../middlewares/zod.validate.js";
import { createUserSchema, updateUserSchema } from "../../schemas/user.schema.js";
import { authMiddleware } from "../../factory/auth.factory.js";
import { idempotencyMiddleware } from "../../middlewares/idempotency.middleware.js";

const userRouter = express.Router();
const userController = userFactory.create();

userRouter.post("/", idempotencyMiddleware ,errorHandler.controllerWrapper(validate(createUserSchema)), errorHandler.controllerWrapper(userController.create));

userRouter.use(authMiddleware.authenticate);
userRouter.get("/", errorHandler.controllerWrapper(userController.get));

userRouter.delete("/", errorHandler.controllerWrapper(userController.delete));

userRouter.patch("/", idempotencyMiddleware, errorHandler.controllerWrapper(validate(updateUserSchema)), errorHandler.controllerWrapper(userController.update));

export { userRouter };