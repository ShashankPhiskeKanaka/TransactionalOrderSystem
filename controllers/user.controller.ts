import type { Request, Response } from "express";
import type { userServicesClass } from "../services/user.services.js";
import type { authServicesClass } from "../services/auth.services.js";
import { responseMessages } from "../constants/response.messages.js";
import { redisUtils } from "../factory/utils.factory.js";

const userResponse = new responseMessages("User")
const usersResponse = new responseMessages("Users");

class userControllerClass {
    constructor ( private userService : userServicesClass ) {};

    create = async ( req: Request, res: Response ) => {
        const user = await this.userService.create(req.body);
        return res.json({
            success : true,
            message : userResponse.CREATED,
            data : user
        });
    }

    get = async ( req: Request, res: Response ) => {
        const user = await this.userService.get(req.user.id);

        redisUtils.invalidateKey(req.user.id, "user")

        return res.json({
            success : true,
            message: userResponse.FETCHED,
            data : user
        });
    }

    getAll = async (req: Request, res: Response) => {
        const users = await this.userService.getAll();
        return res.json({
            success : true,
            message : usersResponse.FETCHED,
            data : users
        });
    }

    update = async (req: Request, res: Response) => {
        const user = await this.userService.update({
            id: req.user.id,
            ...req.body
        });

        redisUtils.invalidateKey(req.user.id, "user")

        return res.json({
            success : true,
            message : userResponse.UPDATED,
            data : user
        });
    }

    delete = async (req: Request, res : Response) => {
        const user = await this.userService.delete(req.user.role === 'ADMIN' ? req.body.id : req.user.id, req.cookies.refreshToken);

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        redisUtils.invalidateKey(req.user.id, "user");

        return res.json({
            success : true,
            message : userResponse.DELETED,
            data : user
        });
    }
}

export { userControllerClass }