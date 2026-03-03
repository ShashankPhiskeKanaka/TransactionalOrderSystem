import express from "express"
import { userFactory } from "../factory/user.factory.js";
import { errorHandler } from "../factory/utils.factory.js";
import { validate } from "../middlewares/zod.validate.js";
import { createUserSchema } from "../schemas/user.schema.js";

const userRouter = express.Router();
const userController = userFactory.create();

userRouter.post("/", errorHandler.controllerWrapper(validate(createUserSchema)), errorHandler.controllerWrapper(userController.create));

export { userRouter };