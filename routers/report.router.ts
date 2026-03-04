import express from "express"
import { reportFactory } from "../factory/report.factory.js";

const reportRouter = express.Router();
const reportController = reportFactory.create();

export { reportRouter };