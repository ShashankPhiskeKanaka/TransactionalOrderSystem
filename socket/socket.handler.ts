import { Server, Socket } from "socket.io";
import { serverError } from "../utils/error.utils.js";
import { MessageService } from "./socket.service.js";

const registerChatHandlers = ( io : Server, socket : Socket ) => {
    socket.on("private_message", async (payload) => {
        try{
            const savedMessage = await MessageService.saveAndDistribute(payload, socket.data.userId);
            io.to(payload.to).emit("new_message", savedMessage);
            socket.emit("message_sent", { id: savedMessage.id});
        }catch (err : any){
            throw new serverError(err);
        }
    });

    socket.on("global_message", async (payload) => {
        try{
            const savedMessage = await MessageService.saveAndDistribute(payload, socket.data.userId);
            io.to("global").emit("new_global_message", savedMessage);
        }catch (err : any) {
            throw new serverError(err);
        }
    })
}

export { registerChatHandlers }