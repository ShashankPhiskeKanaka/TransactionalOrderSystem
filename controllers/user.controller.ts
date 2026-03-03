import type { Request, Response } from "express";
import type { userServicesClass } from "../services/user.services.js";

class userControllerClass {
    constructor ( private userService : userServicesClass ) {};

    create = async ( req: Request, res: Response ) => {
        const user = await this.userService.create(req.body);
        return res.json({
            success : true,
            message : "User created successfully",
            data : user
        });
    }

    // get = async ( req: Request, res: Response ) => {
    //     const user = await this.userService.
    // }
}

export { userControllerClass }