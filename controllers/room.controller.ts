import type { Request, Response } from "express";
import type { roomServicesClass } from "../services/room.services.js";

class roomControllerClass {
    constructor ( private roomService : roomServicesClass ) {}

    create = async ( req: Request, res: Response ) => {
        const data = await this.roomService.create(req.body.name);
        return res.json({
            success : true,
            message : "New room created",
            data: data
        });
    }
    addUser = async ( req: Request, res: Response ) => {
        const data = await this.roomService.addUser(req.user.id, req.params.id?.toString() ?? "");
        return res.json({
            success : true,
            message : "New room created",
            data: data
        });
    }
    removeUser = async ( req: Request, res: Response ) => {
        const data = await this.roomService.removeUser(req.user.id, req.params.id?.toString() ?? "");
        return res.json({
            success : true,
            message : "New room created",
            data: data
        });
    }
}

export { roomControllerClass }