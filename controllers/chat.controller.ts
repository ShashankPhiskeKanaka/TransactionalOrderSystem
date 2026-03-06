import type { Request, Response } from "express";
import type { MessageServiceClass } from "../socket/socket.service.js";

class chatControllerClass {
    constructor ( private chatService : MessageServiceClass ) {}

    getHistory = async ( req: Request, res : Response ) => {
        const messages = await this.chatService.getHistory(req.user.id, req.params.id?.toString() ?? "");
        return res.json({
            success : true,
            message : "Chat history fetched",
            data : messages
        });
    }
}

export { chatControllerClass }