import { authUtilsClass } from "../utils/auth.utils.js";
import { errorHandlerClass, globalErrorHandlerClass } from "../utils/error.utils.js";

const globalErrorHandler = new globalErrorHandlerClass();
const errorHandler = new errorHandlerClass();

const authUtils = new authUtilsClass()

export { globalErrorHandler, errorHandler, authUtils }