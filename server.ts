import express from "express"
import dotenv from "dotenv"
import { globalErrorHandler } from "./factory/utils.factory.js";
import { authRouter } from "./routers/auth.router.js";
import { userRouter } from "./routers/user.routers/user.router.js";
import cookieParser from "cookie-parser"
import { connectPrisma } from "./db/prisma.js";
import { walletRouter } from "./routers/wallet.routers/wallet.router.js";
import { walletsRouter } from "./routers/wallet.routers/wallets.router.js";
import { orderRouter } from "./routers/order.router.js";
import { productRouter } from "./routers/product.router.js";
import { reportRouter } from "./routers/report.router.js";
import { logger } from "./middlewares/logger.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { idempotencyMiddleware } from "./middlewares/idempotency.middleware.js";
import { createServer } from "node:http";
import { SocketServer } from "./socket/socket.server.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
app.use(express.json());
app.use(cookieParser());

SocketServer.init(httpServer);

app.use(logger);
app.use(rateLimiter);
// app.use(idempotencyMiddleware);

app.use("/v1/auth", authRouter);

app.use("/v1/user", userRouter);
app.use("/v1/users", userRouter);

app.use("/v1/wallet", walletRouter);
app.use("/v1/wallets", walletsRouter);

app.use("/v1/order", orderRouter);

app.use("/v1/product", productRouter);

app.use("/v1/report", reportRouter);

app.use(globalErrorHandler.handleError);

httpServer.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})