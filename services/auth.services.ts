import { errorMessage } from "../constants/error.messages.js";
import { authUtils } from "../factory/utils.factory.js";
import type { authPgRepositoryClass } from "../repositories/auth.repository.ts/auth.pgrepository.js";
import type { userAuthType } from "../repositories/user.repository.ts/user.methods.js";
import type { userPgRepositoryClass } from "../repositories/user.repository.ts/user.pgrepository.js";
import { serverError } from "../utils/error.utils.js";
import crypto, { hash } from "crypto"

class authServicesClass {
    constructor ( private userMethods : userPgRepositoryClass, private authMethods : authPgRepositoryClass ) {};

    login = async ( data : any ) => {
        const user = await this.userMethods.getByMail(data.email ?? "");
        if(!user) throw new serverError(errorMessage.NOTFOUND);

        const flag = await authUtils.comparePasswords(data.password, user.password ?? "");
        if(flag){
            const token = authUtils.generateAccessToken(user.id ?? "", user.role ?? "");

            const familyId = crypto.randomUUID();
            const refreshToken = await this.authMethods.create({ userId: user.id ?? "", familyId });

            return { token, refreshToken : refreshToken.id }
        }

        throw new serverError(errorMessage.LOGINERROR);
    }

    logout = async ( token: string, fromAllDevices : boolean ) => {

        const refreshTokenData = await this.authMethods.get(token);
        if(!refreshTokenData) throw new serverError(errorMessage.UNAUTHORIZED);

        if(fromAllDevices){
            await this.authMethods.deleteByUser(refreshTokenData.userId ?? "");
        }else{
            await this.authMethods.deleteByFamily(refreshTokenData.familyId ?? "");
        }

        return;
    }

    forgetPassword = async ( email: string ) => {
        const user = await this.userMethods.getByMail(email);
        if(!user) throw new serverError(errorMessage.NOTFOUND);

        const forgetToken = authUtils.generateForgetToken(user.id ?? "");
        return forgetToken;
    }

    changePassword = async ( token : string, password : string ) => {
        const data = authUtils.decodeForgetToken(token);
        let user = await this.userMethods.get(data.id);
        if(!user) throw new serverError(errorMessage.NOTFOUND);

        const hashedPassword = await authUtils.hashPassword(password);
        user = await this.userMethods.update({
            id: user.id ?? "",
            password : hashedPassword
        });
    }

    generateTokens = async ( refreshToken: string ) => {
        const refreshTokenData = await this.authMethods.get(refreshToken);
        if(!refreshTokenData) throw new serverError(errorMessage.NOTFOUND);
        const user = await this.userMethods.get(refreshTokenData.userId ?? "");
        if(!user) throw new serverError(errorMessage.NOTFOUND);

        const token = authUtils.generateAccessToken(user.id ?? "", user.role ?? "");
        const newRefreshToken = await this.authMethods.create({
            familyId : refreshTokenData.familyId ?? "",
            userId: user.id ?? ""
        });

        return { token, refreshToken : newRefreshToken.id }
    }
}

export { authServicesClass }