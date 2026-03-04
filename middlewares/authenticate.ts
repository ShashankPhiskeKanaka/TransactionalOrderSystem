import type { NextFunction, Request, Response } from "express";
import { errorMessage } from "../constants/error.messages.js";
import type { authServicesClass } from "../services/auth.services.js";
import { authUtils } from "../factory/utils.factory.js";

class authenticateUserClass {
    constructor ( private authService : authServicesClass ) {};

    authenticate = async ( req: Request, res: Response, next: NextFunction ) => {
        const accessToken = req.cookies.accessToken;
        const oldRefreshToken = req.cookies.refreshToken;
        let newAccessToken;
        if(!oldRefreshToken){
            return res.status(errorMessage.UNAUTHORIZED.status).json({
                success : false,
                message : errorMessage.UNAUTHORIZED.message
            });
        }

        if(!accessToken) {
            const { token, refreshToken } = await this.authService.generateTokens(oldRefreshToken);
            newAccessToken = token;
            res.cookie("accessToken", token, { sameSite: true, httpOnly: true, maxAge: 15*60*1000 });
            res.cookie("refreshToken", refreshToken, { sameSite: true, httpOnly: true, maxAge: 7*24*60*60*1000 });
        }

        const { id, role } = authUtils.decodeAccesstoken(newAccessToken ? newAccessToken : accessToken);
        req.user = { id, role };

        next();
    }

    authenticateAdmin = async ( req: Request, res: Response, next: NextFunction ) => {
        const accessToken = req.cookies.accessToken;
        const oldRefreshToken = req.cookies.refreshToken;
        let newAccessToken;
        if(!oldRefreshToken){
            return res.status(errorMessage.UNAUTHORIZED.status).json({
                success : false,
                message : errorMessage.UNAUTHORIZED.message
            });
        }

        if(!accessToken) {
            const { token, refreshToken } = await this.authService.generateTokens(oldRefreshToken);
            newAccessToken = token;
            res.cookie("accessToken", token, { sameSite: true, httpOnly: true, maxAge: 15*60*1000 });
            res.cookie("refreshToken", refreshToken, { sameSite: true, httpOnly: true, maxAge: 7*24*60*60*1000 });
        }

        const { id, role } = authUtils.decodeAccesstoken(newAccessToken ? newAccessToken : accessToken);
        if(role !== 'ADMIN'){
            return res.status(errorMessage.UNAUTHORIZED.status).json({
                success : false,
                message : errorMessage.UNAUTHORIZED.message
            });
        }
        req.user = { id, role };

        next();
    }
}

export { authenticateUserClass };