import express from "express"
import dotenv from "dotenv"
import { globalErrorHandler } from "./factory/utils.factory.js";
import { authRouter } from "./routers/auth.router.js";
import { userRouter } from "./routers/user.router.js";
import cookieParser from "cookie-parser"
import { connectPrisma } from "./db/prisma.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);

app.use(globalErrorHandler.handleError);

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`)
})