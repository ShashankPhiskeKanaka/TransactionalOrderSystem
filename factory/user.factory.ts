import { userControllerClass } from "../controllers/user.controller.js";
import { authPgRepositoryClass } from "../repositories/auth.repository/auth.pgrepository.js";
import { userPgRepositoryClass } from "../repositories/user.repository/user.pgrepository.js";
import { walletPgRepositoryClass } from "../repositories/wallet.repository/wallet.pgrepository.js";
import { authServicesClass } from "../services/auth.services.js";
import { userServicesClass } from "../services/user.services.js";

class userFactory {
    static create (){
        const repo = new userPgRepositoryClass();
        const authRepo = new authPgRepositoryClass();
        const walletRepo = new walletPgRepositoryClass();
        const service = new userServicesClass(repo, authRepo, walletRepo);

        const controller = new userControllerClass(service);

        return controller;
    }
}

export { userFactory };