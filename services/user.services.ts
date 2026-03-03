import { errorMessage } from "../constants/error.messages.js";
import { authUtils } from "../factory/utils.factory.js";
import type { authPgRepositoryClass } from "../repositories/auth.repository.ts/auth.pgrepository.js";
import type { userPgRepositoryClass } from "../repositories/user.repository.ts/user.pgrepository.js";
import { serverError } from "../utils/error.utils.js";
import { logUtil } from "../utils/log.utils.js";

class userServicesClass {
    constructor ( private userMethods : userPgRepositoryClass, private authMethods : authPgRepositoryClass ) {};

    create = async ( data : any ) => {
        const hashedPassword = await authUtils.hashPassword(data.password ?? "");

        const user = await this.userMethods.create({
            ...data,
            password : hashedPassword
        });
        logUtil.logActivity(`New user with the id : ${user.id} created`);
        return user;
    }

    get = async ( id : string ) => {
        const user = await this.userMethods.get(id);
        if(!user.id) throw new serverError(errorMessage.NOTFOUND);
        return user;
    }

    getAll = async () => {
        const users = await this.userMethods.getAll();
        return users;
    }

    update = async (data : any) => {
        const user = await this.userMethods.update(data);
        if(!user.id) throw new serverError(errorMessage.NOTFOUND);

        return user;
    }

    delete = async (id: string, token : string) => {
        const user = await this.userMethods.delete(id);
        if(!user.id) throw new serverError(errorMessage.NOTFOUND);

        const refreshTokenData = await this.authMethods.get(token);
        if(!refreshTokenData.id) throw new serverError(errorMessage.UNAUTHORIZED);

        await this.authMethods.deleteByUser(token);
        return user;
    }
}

export { userServicesClass }