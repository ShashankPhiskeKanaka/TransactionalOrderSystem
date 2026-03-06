import { roomControllerClass } from "../controllers/room.controller.js";
import { roomPgRepositoryClass } from "../repositories/room.repository/room.pgrepository.js";
import { roomServicesClass } from "../services/room.services.js";

class roomFactory {
    static create () {
        const repo = new roomPgRepositoryClass();
        const service = new roomServicesClass(repo);
        const controller = new roomControllerClass(service);

        return controller;
    }
}

export { roomFactory };