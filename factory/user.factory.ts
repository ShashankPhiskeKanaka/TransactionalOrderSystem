import { userControllerClass } from "../controllers/user.controller.js";
import { authPgRepositoryClass } from "../repositories/auth.repository.ts/auth.pgrepository.js";
import { userPgRepositoryClass } from "../repositories/user.repository.ts/user.pgrepository.js";
import { authServicesClass } from "../services/auth.services.js";
import { userServicesClass } from "../services/user.services.js";

class userFactory {
    static create (){
        const repo = new userPgRepositoryClass();
        const authRepo = new authPgRepositoryClass();
        const service = new userServicesClass(repo, authRepo);

        const controller = new userControllerClass(service);

        return controller;
    }
}

export { userFactory };