import express from "express"
import { userFactory } from "../../factory/user.factory.js";
import { errorHandler } from "../../factory/utils.factory.js";
import { authMiddleware } from "../../factory/auth.factory.js";

const usersRouter = express.Router();
const userController = userFactory.create();

usersRouter.use(authMiddleware.authenticateAdmin);
usersRouter.get("/", errorHandler.controllerWrapper(userController.getAll));


export { usersRouter };