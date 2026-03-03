import { authControllerClass } from "../controllers/auth.controller.js";
import { authenticateUserClass } from "../middlewares/authenticate.js";
import { authPgRepositoryClass } from "../repositories/auth.repository.ts/auth.pgrepository.js";
import { userPgRepositoryClass } from "../repositories/user.repository.ts/user.pgrepository.js";
import { authServicesClass } from "../services/auth.services.js";

class authFactory {
    static create (){
        const userRepo = new userPgRepositoryClass();
        const authRepo = new authPgRepositoryClass();
        const service = new authServicesClass(userRepo, authRepo);
        const controller = new authControllerClass(service);

        return controller;
    }

    static createAuthMiddleware () {
        const userRepo = new userPgRepositoryClass();
        const authRepo = new authPgRepositoryClass();
        const service = new authServicesClass(userRepo, authRepo);
        const authMiddleware = new authenticateUserClass(service);

        return authMiddleware;
    }
}

const authMiddleware = authFactory.createAuthMiddleware();
export { authFactory, authMiddleware }