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
import { rateLimiter } from "./middlewares/rateLimiter.js";
import { idempotencyMiddleware } from "./middlewares/idempotency.middleware.js";
import { createServer } from "node:http";
import { SocketServer } from "./socket/socket.server.js";
import { roomRouter } from "./routers/room.router.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { Server } from "socket.io"
import { reqLogger } from "./middlewares/reqLogger.js";
import logger from "./utils/logger.js";
import os from "os"

dotenv.config();

const app = express();
const httpServer = createServer(app);
app.use(express.json());
app.use(cookieParser());
app.use(reqLogger);

const io = new Server(httpServer, {
    cors: { origin: "*" }
});

SocketServer.init(httpServer);

app.get('/', (req, res) => {

    setTimeout(() => {
        res.send({
            message: "Hello from the server!",
            containerId: os.hostname(), // Shows which container handled the request
            processId: process.pid      // Shows which PM2 worker handled the request
        });
    }, 500);
});

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

app.use("/v1/room", roomRouter);

app.use(globalErrorHandler.handleError);

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

// 1. Convert to number first
const PORT = Number(process.env.PORT) || 3000;

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  
  // 2. Use the 'PORT' variable (which is a number) here
  httpServer.listen(PORT, '0.0.0.0', () => {
    logger.info("Server started", { port: PORT, pid: process.pid });
  });
});
