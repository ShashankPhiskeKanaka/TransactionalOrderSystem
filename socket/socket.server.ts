import { Server } from "socket.io"
import { logUtil } from "../utils/log.utils.js";
import { registerChatHandlers } from "./socket.handler.js";
import { serverError } from "../utils/error.utils.js";
import { UsersScalarFieldEnum } from "../generated/prisma/internal/prismaNamespace.js";
import { errorMessage } from "../constants/error.messages.js";
import cookie from "cookie";
import { authUtils } from "../factory/utils.factory.js";

class SocketServer {
    private static io : Server;

    public static init (httpServer: any) {
        this.io = new Server(httpServer, {
            cors : { origin : "*" }
        });

        this.io.use((socket, next) => {
            const rawCookies = socket.handshake.headers.cookie;
            try {
                if(!rawCookies) {
                    throw new serverError(errorMessage.UNAUTHORIZED);
                }
                const cookies = cookie.parse(rawCookies);
                const accessToken = cookies.accessToken;
                const { id, role } = authUtils.decodeAccesstoken(accessToken ?? "");
                // const user = verifyToken(token); 
                socket.data.userId = id; // Mocking verified ID
                next();
            } catch (err) {
                next(new Error("Authentication error"));
            }
        });

        this.io.on("connection", (socket) => {
            const userId = socket.data.userId;

            if(userId) {
                socket.join(userId);
            }
            logUtil.logActivity(`User ${userId} joined the room. Socket : ${socket.id}`);
            console.log()
            registerChatHandlers(this.io, socket);
        });

        return this.io;
    }

    public static getio() {
        if (!this.io) throw new serverError({ status : 400, message :  "Socket.io not initialized" })
        return this.io;
    }
}

export { SocketServer }