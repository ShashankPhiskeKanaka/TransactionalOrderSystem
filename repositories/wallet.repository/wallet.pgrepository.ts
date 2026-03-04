import { prisma } from "../../db/prisma.js";
import type { userAuthType } from "../user.repository/user.methods.js";
import { walletMethodsClass, type provideWalletType, type walletType } from "./wallet.methods.js";

class walletPgRepositoryClass extends walletMethodsClass {
    create = async (userData: userAuthType): Promise<walletType> => {
        const newWallet = await prisma.wallets.create({
            data: {
                user: {
                    connect: { id: userData.id ?? "" }
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

    incrementBalance = async (data: walletType, userData: userAuthType): Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            const where : any = {
                id: data.id,
                deletedAt: null
            }

            if(userData.role !== "ADMIN") {
                where.userId = userData.id
            }
            const wallet = await tx.wallets.update({
                where : where,
                data : {
                    balance : { increment: data.balance }
                }
            });

            await tx.walletTransactions.create({
                data: {
                    walletId : wallet.id,
                    amount: data.balance,
                    type: 'CREDIT',
                }
            })

            return wallet;
        })
    }

    decrementBalance = async (data: walletType, userData: userAuthType): Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            const where : any = {
                id: data.id,
                deletedAt: null
            }

            if(userData.role !== "ADMIN") {
                where.userId = userData.id
            }
            const wallet = await tx.wallets.update({
                where : where,
                data : {
                    balance : { decrement: data.balance }
                }
            });

            await tx.walletTransactions.create({
                data: {
                    walletId : wallet.id,
                    amount: data.balance,
                    type: 'DEBIT',
                }
            })

            return wallet;
        })
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