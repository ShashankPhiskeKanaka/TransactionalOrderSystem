import express from "express"
import { roomFactory } from "../factory/room.factory.js";
import { authMiddleware } from "../factory/auth.factory.js";
import { errorHandler } from "../factory/utils.factory.js";

const roomRouter = express.Router();
const roomController = roomFactory.create();

roomRouter.use(authMiddleware.authenticate);
roomRouter.post("/", errorHandler.controllerWrapper(roomController.create));
roomRouter.patch("/:id", errorHandler.controllerWrapper(roomController.addUser));
roomRouter.delete("/:id", errorHandler.controllerWrapper(roomController.removeUser));

export { roomRouter }