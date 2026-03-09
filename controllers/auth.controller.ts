import type { NextFunction, Request, Response } from "express";
import type { authServicesClass } from "../services/auth.services.js";
import logger from "../utils/logger.js";

class authControllerClass {
    constructor ( private authService : authServicesClass ) {}

    /**
     * Handles the process of user login
     * 
     * @param {Request} req - Expects email and password in body
     * @param  {Response} res - Returns HttpOnly cookies on success
     */
    login = async ( req: Request, res : Response ) => {

        // Stage 1: Log the injestion of a login signal (Audit trail)
        logger.info("Login process initiated", {
            path : req.path,
            ip: req.ip,
            email : req.body.email
        });

        const { token, refreshToken } = await this.authService.login(req.body);

        // 15min expiry for accessToken and 7day expiry for refreshToken
        // using httpOnly and sameSite to mitigate XSS and CSRF attacks
        res.cookie("accessToken", token, { httpOnly: true, sameSite: 'strict', maxAge: 15*60*1000 });
        res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: 7*24*60*60*1000 });

        return res.json({
            success : true,
            message : "Successfully logged in"
        });
    }

    /**
     * Handles process of user logout
     * 
     * @param {Request} req - Expects refreshToken from cookies and flag from params  
     * @param {Response} res - Returns a message and boolean value on success
     */
    logout = async ( req: Request, res: Response ) => {

        // Stage 1: log the injestion of logout signal (audit trail)
        logger.info("Logout process initiated", {
            path: req.path,
            ip: req.ip
        });

        await this.authService.logout(req.cookies.refreshToken ?? "", req.params.flag?.toString() === "true");

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.json({
            success : true,
            message : "Successfully logged out"
        });
    }

    /**
     * Handles the process of forget password initiation
     * 
     * @param {Request} req - Expects an email in params 
     * @param {Response} res - Returns a url path with forget password token embedded inside on success
     */
    forgetPassword = async ( req: Request, res: Response ) => {

        // Stage 1: Log the injestion of a forget password process (audit trail)
        logger.info("Forget password process initiated", {
            path: req.path,
            ip: req.ip,
            email: req.params.email
        });

        const token = await this.authService.forgetPassword(req.params.email?.toString() ?? "");

        return res.json({
            success : true,
            message : `Visit the link to change password : localhost:3000/v1/auth/${token}`
        });
    }

    /**
     * Handles the process of changing the password
     * 
     * @param {Request} req - Expects forget password token from params and new password from body 
     * @param {Response} res - Returns success message and boolean value on success 
     * @returns 
     */
    changePassword = async ( req: Request, res: Response ) => {

        // Stage 1: Log the injestion of change password signal (audit trail)
        logger.info("Password change process initiated", {
            path: req.path,
            ip: req.ip
        });

        await this.authService.changePassword(req.params.token?.toString() ?? "", req.body.password);

        return res.json({
            success : true,
            message : "Password changed successfully"
        });
    }
}

export { authControllerClass }