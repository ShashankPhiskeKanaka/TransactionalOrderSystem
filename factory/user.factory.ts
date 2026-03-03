import { userControllerClass } from "../controllers/user.controller.js";
import { userPgRepositoryClass } from "../repositories/user.repository.ts/user.pgrepository.js";
import { userServicesClass } from "../services/user.services.js";

class userFactory {
    static create (){
        const repo = new userPgRepositoryClass();
        const service = new userServicesClass(repo);
        const controller = new userControllerClass(service);

        return controller;
    }
}

export { userFactory };