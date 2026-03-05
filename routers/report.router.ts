import express from "express"
import { reportFactory } from "../factory/report.factory.js";
import { authMiddleware } from "../factory/auth.factory.js";
import { errorHandler } from "../factory/utils.factory.js";
import { validate } from "../middlewares/zod.validate.js";
import { ordersAtSchema, ordersInRangeSchema } from "../schemas/report.schema.js";

const reportRouter = express.Router();
const reportController = reportFactory.create();

reportRouter.use(authMiddleware.authenticateAdmin);

reportRouter.get("/user-activity", errorHandler.controllerWrapper(reportController.userActivity));
reportRouter.get("/daily-orders", errorHandler.controllerWrapper(reportController.dailyOrders));
reportRouter.get("/orders-at/:date", errorHandler.controllerWrapper(validate(ordersAtSchema)), errorHandler.controllerWrapper(reportController.ordersAtDate));
reportRouter.get("/orders-in", errorHandler.controllerWrapper(validate(ordersInRangeSchema)), errorHandler.controllerWrapper(reportController.ordersInRange));
reportRouter.get("/product-report", errorHandler.controllerWrapper(reportController.productReport));

export { reportRouter };