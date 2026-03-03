import express from "express"
import { userFactory } from "../../factory/user.factory.js";
import { errorHandler } from "../../factory/utils.factory.js";
import { validate } from "../../middlewares/zod.validate.js";
import { createUserSchema, updateUserSchema } from "../../schemas/user.schema.js";
import { authMiddleware } from "../../factory/auth.factory.js";

const userRouter = express.Router();
const userController = userFactory.create();

userRouter.post("/", errorHandler.controllerWrapper(validate(createUserSchema)), errorHandler.controllerWrapper(userController.create));

userRouter.use(authMiddleware.authenticate);
userRouter.get("/", errorHandler.controllerWrapper(userController.get));
userRouter.patch("/", errorHandler.controllerWrapper(validate(updateUserSchema)), errorHandler.controllerWrapper(userController.update));
userRouter.delete("/", errorHandler.controllerWrapper(userController.delete));

export { userRouter };