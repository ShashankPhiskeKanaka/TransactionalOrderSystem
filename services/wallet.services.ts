import { errorMessage } from "../constants/error.messages.js";
import type { userAuthType } from "../repositories/user.repository.ts/user.methods.js";
import type { walletPgRepositoryClass } from "../repositories/wallet.repository.ts/wallet.pgrepository.js";
import { serverError } from "../utils/error.utils.js";
import { logUtil } from "../utils/log.utils.js";

class walletServicesClass {
    constructor ( private walletMethods : walletPgRepositoryClass ) {};

    create = async ( data: any, userData : userAuthType ) => {
        const wallet = await this.walletMethods.create(data, userData);
        logUtil.logActivity(`New wallet with the id : ${wallet.id} created for user with the id : ${userData.id}`);

        return wallet;
    }

    get = async ( id: string, userData: userAuthType ) => {
        const wallet = await this.walletMethods.get(id, userData);
        if(!wallet.id) throw new serverError(errorMessage.NOTFOUND);

        logUtil.logActivity(`New wallet with the id : ${wallet.id} fetched by user with the id : ${userData.id}`);
        return wallet;
    }

    update = async ( data: any, userData: userAuthType ) => {
        const wallet = await this.walletMethods.update(data, userData);
        if(!wallet.id) throw new serverError(errorMessage.NOTFOUND);
        logUtil.logActivity(`New wallet with the id : ${wallet.id} updated by user with the id : ${userData.id}`);

        return wallet;
    }

    getAll = async () => {
        const wallets = await this.walletMethods.getAll();
        logUtil.logActivity(`Multiple wallets fetched by admin`);
        
        return wallets;
    }
}

export { walletServicesClass }