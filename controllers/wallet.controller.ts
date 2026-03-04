import type { Request, Response } from "express";
import type { walletServicesClass } from "../services/wallet.services.js";
import { responseMessages } from "../constants/response.messages.js";

const walletResponse = new responseMessages("Wallet");
const walletsResponse = new responseMessages("Wallets");

class walletControllerClass {
    constructor (private walletService : walletServicesClass) {};

    get = async (req : Request, res : Response) => {
        const wallet = await this.walletService.get(req.body.id, req.user);
        return res.json({
            success : true,
            message : walletResponse.FETCHED,
            data : wallet
        });
    }

    getAll = async (req : Request, res : Response) => {
        const wallets = await this.walletService.getAll();
        return res.json({
            success : true,
            message : walletsResponse.FETCHED,
            data : wallets
        });
    }

    incrementBalance = async (req: Request, res : Response) => {
        const wallet = await this.walletService.incrementBalance(req.body, req.user);
        return res.json({
            success : true,
            message : walletResponse.UPDATED,
            data : wallet
        });
    }

    decrementBalance = async (req: Request, res : Response) => {
        const wallet = await this.walletService.decrementBalance(req.body, req.user);
        return res.json({
            success : true,
            message : walletResponse.UPDATED,
            data : wallet
        });
    }
}

export { walletControllerClass }