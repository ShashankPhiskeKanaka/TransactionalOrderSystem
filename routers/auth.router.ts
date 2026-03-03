import express from "express"
import { errorHandler } from "../factory/utils.factory.js";
import { validate } from "../middlewares/zod.validate.js";
import { changePasswordSchema, forgetPasswordSchema, loginSchema } from "../schemas/auth.schema.js";
import { authFactory, authMiddleware } from "../factory/auth.factory.js";

const authRouter = express.Router();
const authController = authFactory.create();

authRouter.post("/login", errorHandler.controllerWrapper(validate(loginSchema)), errorHandler.controllerWrapper(authController.login));
authRouter.get("forget/:email", errorHandler.controllerWrapper(validate(forgetPasswordSchema)), errorHandler.controllerWrapper(authController.forgetPassword));
authRouter.patch("/:token", errorHandler.controllerWrapper(validate(changePasswordSchema)), errorHandler.controllerWrapper(authController.changePassword));

authRouter.use(authMiddleware.authenticate);
authRouter.get("/logout", errorHandler.controllerWrapper(authController.logout));

export { authRouter };