import { prisma } from "../../db/prisma.js";
import type { userAuthType } from "../user.repository.ts/user.methods.js";
import { walletMethodsClass, type provideWalletType, type walletType } from "./wallet.methods.js";

class walletPgRepositoryClass extends walletMethodsClass {
    create = async (data: provideWalletType, userData: userAuthType): Promise<walletType> => {
        const newWallet = await prisma.wallets.create({
            data: {
                user: {
                    connect: { id: data.userId }
                }
            }
        });

        return newWallet;
    }
    get = async (id: string, userData: userAuthType): Promise<walletType> => {
        const where : any = {
            id: id,
            deletedAt: null
        }

        if(userData.role !== "ADMIN") {
            where.userId = userData.id
        }

        const wallet = await prisma.wallets.findFirst({
            where : where
        });

        return wallet ?? <walletType>{};
    }

    getAll = async (): Promise<walletType[]> => {
        const wallets = await prisma.wallets.findMany({
            where : {
                deletedAt: null
            }
        });

        return wallets;
    }

    update = async (data: walletType, userData: userAuthType): Promise<walletType> => {
        const where : any = {
            id: data.id,
            deletedAt: null
        }

        if(userData.role !== "ADMIN") {
            where.userId = userData.id
        }
        const wallet = await prisma.wallets.update({
            where : where,
            data : {
                balance : data.balance
            }
        });

        return wallet;
    }

    delete = async (id: string, userData: userAuthType): Promise<walletType> => {
        const where : any = {
            id: id,
            deletedAt: null
        }

        if(userData.role !== "ADMIN") {
            where.userId = userData.id
        }
        const wallet = await prisma.wallets.delete({
            where : where
        });

        return wallet;
    }
}

export { walletPgRepositoryClass }