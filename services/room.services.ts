import type { roomPgRepositoryClass } from "../repositories/room.repository/room.pgrepository.js";
import { logUtil } from "../utils/log.utils.js";

class roomServicesClass {
    constructor ( private roomMethods : roomPgRepositoryClass ) {}

    create = async ( name : string ) => {
        const data = await this.roomMethods.create(name);
        logUtil.logActivity(`New room created with the id : ${data.id}`);
        return data;
    }

    addUser = async ( userId : string, roomId : string ) => {
        const data = await this.roomMethods.addUser(roomId, userId);
        logUtil.logActivity(`User with the id : ${userId} added into the rom with the id : ${roomId}`)
    }

    removeUser = async ( userId : string, roomId : string ) => {
        const data = await this.roomMethods.removeUser(roomId, userId);
        logUtil.logActivity(`User with the id : ${userId} removed from the rom with the id : ${roomId}`)
    }
}

export { roomServicesClass }