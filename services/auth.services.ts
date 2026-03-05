import { errorMessage } from "../constants/error.messages.js";
import { authUtils } from "../factory/utils.factory.js";
import type { authPgRepositoryClass } from "../repositories/auth.repository/auth.pgrepository.js";
import type { userPgRepositoryClass } from "../repositories/user.repository/user.pgrepository.js";
import { serverError } from "../utils/error.utils.js";
import crypto from "crypto"
import { logUtil } from "../utils/log.utils.js";

class authServicesClass {
    constructor ( private userMethods : userPgRepositoryClass, private authMethods : authPgRepositoryClass ) {};

    login = async ( data : any ) => {
        const user = await this.userMethods.getByMail(data.email ?? "");
        if(!user.id) throw new serverError(errorMessage.NOTFOUND);

        const flag = await authUtils.comparePasswords(data.password, user.password ?? "");
        if(flag){
            const token = authUtils.generateAccessToken(user.id ?? "", user.role ?? "");

            const familyId = crypto.randomUUID();
            const refreshToken = await this.authMethods.create({ userId: user.id ?? "", familyId });

            logUtil.logActivity(`User with the id : ${user.id} and role : ${user.role} logged in`);
            return { token, refreshToken : refreshToken.id }
        }

        throw new serverError(errorMessage.LOGINERROR);
    }

    logout = async ( token: string, fromAllDevices : boolean ) => {

        const refreshTokenData = await this.authMethods.get(token);
        if(!refreshTokenData.id) throw new serverError(errorMessage.UNAUTHORIZED);

        if(fromAllDevices){
            await this.authMethods.deleteByUser(refreshTokenData.userId ?? "");
        }else{
            await this.authMethods.deleteByFamily(refreshTokenData.familyId ?? "");
        }

        logUtil.logActivity("User logged out")
        return;
    }

    forgetPassword = async ( email: string ) => {
        const user = await this.userMethods.getByMail(email);
        if(!user.id) throw new serverError(errorMessage.NOTFOUND);

        const forgetToken = authUtils.generateForgetToken(user.id ?? "");

        logUtil.logActivity(`Forget password token generated for email : ${email}`);
        return forgetToken;
    }

    changePassword = async ( token : string, password : string ) => {
        const data = authUtils.decodeForgetToken(token);
        let user = await this.userMethods.get(data.id);
        if(!user.id) throw new serverError(errorMessage.NOTFOUND);

        const hashedPassword = await authUtils.hashPassword(password);
        user = await this.userMethods.update({
            id: user.id ?? "",
            password : hashedPassword
        });

        logUtil.logActivity(`Password changed for user with the id : ${user.id}`);
    }

    generateTokens = async ( refreshToken: string ) => {
        const refreshTokenData = await this.authMethods.get(refreshToken);
        if(!refreshTokenData.id) throw new serverError(errorMessage.UNAUTHORIZED);
        if(refreshTokenData.used) {
            this.logout(refreshToken, true);
            throw new serverError(errorMessage.UNAUTHORIZED);
        }
        const user = await this.userMethods.get(refreshTokenData.userId ?? "");
        if(!user.id) throw new serverError(errorMessage.NOTFOUND);

        const token = authUtils.generateAccessToken(user.id ?? "", user.role ?? "");
        const newRefreshToken = await this.authMethods.create({
            familyId : refreshTokenData.familyId ?? "",
            userId: user.id ?? ""
        });

        logUtil.logActivity(`Refresh token and access token generated for user with the id : ${user.id}`);

        return { token, refreshToken : newRefreshToken.id }
    }
}

export { authServicesClass }