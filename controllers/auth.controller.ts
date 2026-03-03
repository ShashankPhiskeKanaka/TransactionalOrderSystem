import type { NextFunction, Request, Response } from "express";
import type { authServicesClass } from "../services/auth.services.js";

class authControllerClass {
    constructor ( private authService : authServicesClass ) {}

    login = async ( req: Request, res : Response ) => {
        const { token, refreshToken } = await this.authService.login(req.body);
        res.cookie("accessToken", token, { httpOnly: true, sameSite: true, maxAge: 15*60*1000 });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: true, maxAge: 7*24*60*60*1000 });

        return res.json({
            success : true,
            message : "Successfully logged in"
        });
    }

    logout = async ( req: Request, res: Response ) => {
        await this.authService.logout(req.cookies.refreshToken ?? "", req.params.flag?.toString() === "true");

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.json({
            success : true,
            message : "Successfully logged out"
        });
    }

    forgetPassword = async ( req: Request, res: Response ) => {
        const token = await this.authService.forgetPassword(req.params.email?.toString() ?? "");

        return res.json({
            success : true,
            message : `Visit the link to change password : localhost:3000/v1/auth/${token}`
        });
    }

    changePassword = async ( req: Request, res: Response ) => {
        await this.authService.changePassword(req.params.token?.toString() ?? "", req.body.password);

        return res.json({
            success : true,
            message : "Password changed successfully"
        });
    }
}

export { authControllerClass }