import { authUtilsClass } from "../utils/auth.utils.js";
import { errorHandlerClass, globalErrorHandlerClass } from "../utils/error.utils.js";
import { redisUtilsClass } from "../utils/redis.utils.js";

const globalErrorHandler = new globalErrorHandlerClass();
const errorHandler = new errorHandlerClass();

const authUtils = new authUtilsClass()

const redisUtils = new redisUtilsClass();

export { globalErrorHandler, errorHandler, authUtils, redisUtils }