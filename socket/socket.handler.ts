import { Server, Socket } from "socket.io";
import { serverError } from "../utils/error.utils.js";
import { MessageService } from "./socket.service.js";
import { prisma } from "../db/prisma.js";
import { logUtil } from "../utils/log.utils.js";
import { roomFactory } from "../factory/room.factory.js";
import { roomPgRepositoryClass } from "../repositories/room.repository/room.pgrepository.js";
import { roomServicesClass } from "../services/room.services.js";

const repo = new roomPgRepositoryClass();
const service = new roomServicesClass(repo);

const registerChatHandlers = ( io : Server, socket : Socket ) => {
    socket.on("message", async (payload, callback) => {
        try{
            const savedMessage = await MessageService.saveAndDistribute(payload, socket.data.userId);
            if(payload.to === '00000000-0000-0000-0000-000000000000'){ 
                io.to("global").emit("new_global_message", savedMessage);
                socket.emit("new_global_message_sent", { id: savedMessage.id });
            }else{
                io.to(payload.to).emit("new_message", savedMessage);
                socket.emit("message_sent", { id: savedMessage.id});
            }

            if(callback) {
                callback ({
                    status : "ok",
                    id: savedMessage.id
                })
            }
            
        }catch (err : any){
            if(callback) {
                callback ({
                    status : "error",
                    message : "Failed to save message"
                })
            }
            throw new serverError(err);
        }
    });

    socket.on("join_room", async (payload: { roomId : string }, callback) => {
        try {
            const userId = socket.data.userId;

            const isMember = await prisma.rooms.findFirst({
                where : {
                    id: payload.roomId,
                    members: { some: { id: userId } }
                }
            });

            if(!isMember) {
                return callback?.({
                    status : "error",
                    message : "Not allowed"
                })
            }

            await socket.join(payload.roomId);

            logUtil.logActivity(`User with the id : ${userId} joined the room with the id : ${payload.roomId}`);
            if(callback) {
                callback({
                    statis: "ok",
                    message : "joined the room"
                });
            }
        }
        catch (err) {
            callback?.({
                status : "error",
                message : "Failed to join room"
            })
        }
    });

    socket.on("leave_room", (payload: { roomId: string }) => {
        socket.leave(payload.roomId);
        logUtil.logActivity(`User left the room with the id : ${payload.roomId}`);
    });

    socket.on("request_join", async (payload: { roomId: string }, callback) => {
        try{
            await service.addUser(socket.data.userId, payload.roomId);
            await socket.join(payload.roomId);
            io.to(payload.roomId).emit("user_joined", { userId : socket.data.userId });
            if(callback) {
                callback({
                    status : "ok",
                    message : "Accepted in room"
                });
            }
        }catch (err) {
            callback?.({
                status : "error",
                message : "Failed to send request"
            });
        }
    });

    socket.on("leave_room_request", async (payload: { roomId: string }, callback) => {
        try{
            await service.removeUser(socket.data.userId, payload.roomId);
            await socket.join(payload.roomId);
            io.to(payload.roomId).emit("user_removed", { userId : socket.data.userId });
            if(callback) {
                callback({
                    status : "ok",
                    message : "Removed from room"
                });
            }
        }catch (err) {
            callback?.({
                status : "error",
                message : "Failed to send request"
            });
        }
    });
}

export { registerChatHandlers }