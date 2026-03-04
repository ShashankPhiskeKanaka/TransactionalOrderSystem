import { prisma } from "../../db/prisma.js";
import { authMethodsClass, type tokenType } from "./auth.methods.js";

class authPgRepositoryClass extends authMethodsClass {
    create = async (data: any): Promise<tokenType> => {
        const newRefreshToken = await prisma.refreshTokens.create({
            data: data
        });

        return newRefreshToken;
    }

    get = async (id: string): Promise<tokenType> => {
        const refreshToken = await prisma.refreshTokens.findFirst({
            where : {
                id: id,
                used: false
            }
        })

        return refreshToken ?? <tokenType>{};
    }

    update = async (id: string, userId: string): Promise<void> => {
        await prisma.refreshTokens.update({
            where : {
                id: id,
                userId: userId,
                used: false
            },
            data: {
                used : true
            }
        });

        return;
    }

    deleteByFamily = async (id: string): Promise<void> => {
        await prisma.refreshTokens.deleteMany({
            where: {
                familyId: id,
                used: false
            }
        });

        return;
    }

    deleteByUser = async (id: string): Promise<void> => {
        await prisma.refreshTokens.deleteMany({
            where: {
                userId: id,
                used: false
            }
        });

        return;
    }
}

export { authPgRepositoryClass }