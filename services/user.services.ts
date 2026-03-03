import { authUtils } from "../factory/utils.factory.js";
import type { userType } from "../repositories/user.repository.ts/user.methods.js";
import type { userPgRepositoryClass } from "../repositories/user.repository.ts/user.pgrepository.js";
import { logUtil } from "../utils/log.utils.js";

class userServicesClass {
    constructor ( private userMethods : userPgRepositoryClass ) {};

    create = async ( data : any ) => {
        const hashedPassword = await authUtils.hashPassword(data.password ?? "");

        const user = await this.userMethods.create({
            ...data,
            password : hashedPassword
        });
        logUtil.logActivity(`New user with the id : ${user.id} created`);
        return user;
    }
}

export { userServicesClass }