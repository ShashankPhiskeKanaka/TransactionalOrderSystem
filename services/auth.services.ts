import { errorMessage } from "../constants/error.messages.js";
import { authUtils } from "../factory/utils.factory.js";
import type { authPgRepositoryClass } from "../repositories/auth.repository/auth.pgrepository.js";
import type { userPgRepositoryClass } from "../repositories/user.repository/user.pgrepository.js";
import { serverError } from "../utils/error.utils.js";
import crypto from "crypto"
import logger from "../utils/logger.js";

class authServicesClass {
    constructor ( private userMethods : userPgRepositoryClass, private authMethods : authPgRepositoryClass ) {};

    /**
     * Authenticates user credentials and creates a session family
     * 
     * @param {any} data - User credentials (email/password) 
     * @throws {serverError} 404 if email not found, 401 for invalid credentials
     * @returns {Promise<authResponse>} Access token and refresh token ID
     */
    login = async ( data : any ) => {

        // Retrieve the stored user record by email
        const user = await this.userMethods.getByMail(data.email ?? "");
        if(!user.id){
            logger.warn("Login Failed: User not found", { email : data.email });
            throw new serverError(errorMessage.NOTFOUND);
        }

        // verify if the provided password against the sotred hashed password
        const flag = await authUtils.comparePasswords(data.password, user.password ?? "");
        if(flag){
            // generate access token
            const token = authUtils.generateAccessToken(user.id ?? "", user.role ?? "");

            // generate unique family ID for this session
            const familyId = crypto.randomUUID();
            // generate refresh token
            const refreshToken = await this.authMethods.create({ userId: user.id ?? "", familyId });

            logger.info("User login successful", {
                userId: user.id,
                role: user.role,
                familyId: familyId
            })
            return { token, refreshToken : refreshToken.id }
        }

        logger.warn("Login Failed : Invalid Credentials", { userId: user.id });
        throw new serverError(errorMessage.LOGINERROR);
    }

    /**
     * Authenticates refresh token existence and deletes the token family based on fromAllDevices boolean value
     * 
     * @param {string} token - refresh token Id 
     * @param {boolean} fromAllDevices - boolean value to determine if logout from all devices or not 
     * @returns 
     */
    logout = async ( token: string, fromAllDevices : boolean ) => {

        // fetch the refresh token record
        const refreshTokenData = await this.authMethods.get(token);
        if(!refreshTokenData.id){
            logger.warn("Logout failed : No refresh token data found", { refreshToken : token });
            throw new serverError(errorMessage.UNAUTHORIZED);
        }

        // using the fromAllDevices flag delete the refresh tokens
        if(fromAllDevices){
            await this.authMethods.deleteByUser(refreshTokenData.userId ?? "");
        }else{
            await this.authMethods.deleteByFamily(refreshTokenData.familyId ?? "");
        }

        logger.info("User logged out successfuly", { refreshToken : token });
        return;
    }

    /**
     * Authenticates the existence of user based on email and generates a forgetPassword token using user's id
     * 
     * @param {string} email - user email 
     * @returns Forget password token embedded with user's id
     */
    forgetPassword = async ( email: string ) => {

        // fetches user record based on email value
        const user = await this.userMethods.getByMail(email);
        if(!user.id){
            logger.warn("Forget password failed : User not found", { email: email });
            throw new serverError(errorMessage.NOTFOUND);
        }

        // generates a forgetToken embedded with user id
        const forgetToken = authUtils.generateForgetToken(user.id ?? "");

        logger.info("Forget password token generated", { email: email, userId: user.id });
        return forgetToken;
    }

    /**
     * Verifies the provided forget password and the user, Updates the user record with new hashed password
     * 
     * @param token 
     * @param password 
     */
    changePassword = async ( token : string, password : string ) => {

        // decodes the forget password token
        const data = authUtils.decodeForgetToken(token);
        // fetches user record from the db
        let user = await this.userMethods.get(data.id);
        if(!user.id){
            logger.warn("Change password failed: No user found", { id: data.id });
            throw new serverError(errorMessage.NOTFOUND);
        }

        const hashedPassword = await authUtils.hashPassword(password);
        user = await this.userMethods.update({
            id: user.id ?? "",
            password : hashedPassword
        });

        logger.info("Password changed successfully", { userId : user.id });
    }

    /**
     * Verifies the refresh token and the user, generates new access token and refresh token
     * 
     * @param refreshToken 
     * @returns 
     */
    generateTokens = async ( refreshToken: string ) => {

        logger.info("Generating new refresh token and access token");

        // fetches fresh token record 
        const refreshTokenData = await this.authMethods.get(refreshToken);
        if(!refreshTokenData.id){
            logger.warn("Token generation error : No refresh token found", { refreshToken : refreshToken });
            throw new serverError(errorMessage.UNAUTHORIZED);
        }
        
        // verifies if the refresh token is used or not to detect attackers, if true deletes all refresh token for that particular user
        if(refreshTokenData.used) {
            logger.warn("Used refresh token provided", { refreshToken: refreshToken });
            this.logout(refreshToken, true);
            throw new serverError(errorMessage.UNAUTHORIZED);
        }

        // fetches user record according to the userId
        const user = await this.userMethods.get(refreshTokenData.userId ?? "");
        if(!user.id){
            logger.warn("Token generation error : No user found", { userId : refreshTokenData.userId });
            throw new serverError(errorMessage.NOTFOUND);
        }

        // generates access token
        const token = authUtils.generateAccessToken(user.id ?? "", user.role ?? "");
        // generates refresh token
        const newRefreshToken = await this.authMethods.create({
            familyId : refreshTokenData.familyId ?? "",
            userId: user.id ?? ""
        });

        logger.info("Refresh token and access token generated successfuly", { userId: user.id });

        return { token, refreshToken : newRefreshToken.id }
    }
}

export { authServicesClass }