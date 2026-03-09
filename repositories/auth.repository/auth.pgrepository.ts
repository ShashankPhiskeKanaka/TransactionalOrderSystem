import { prisma } from "../../db/prisma.js";
import { authMethodsClass, type tokenType } from "./auth.methods.js";

class authPgRepositoryClass extends authMethodsClass {

    /**
     * Persists a new refresh token record in the db
     * 
     * @param {any} data - refresh token id, user id, family id 
     * @returns {Promise<tokenType>} The created refresh token record
     */
    create = async (data: any): Promise<tokenType> => {
        const newRefreshToken = await prisma.refreshTokens.create({
            data: data
        });

        return newRefreshToken;
    }

    /**
     * Fetches a refresh token from the db
     * 
     * @param {string} id - refresh token record id 
     * @returns {Promise<tokenType>} The fetched refresh token record
     */
    get = async (id: string): Promise<tokenType> => {
        const refreshToken = await prisma.refreshTokens.findFirst({
            where : {
                id: id,
                used: false
            }
        })

        return refreshToken ?? <tokenType>{};
    }

    /**
     * Updates the used value of refresh token in the db
     * 
     * @param {string} id - id of the refresh token record
     * @param {string} userId - unique id of the user 
     * @returns {Promise<void>}
     */
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

    /**
     * Deletes refresh tokens according to the family id
     * 
     * @param {string} id - id of the refresh token 
     * @returns {Promise<void>}
     */
    deleteByFamily = async (id: string): Promise<void> => {
        await prisma.refreshTokens.deleteMany({
            where: {
                familyId: id,
                used: false
            }
        });

        return;
    }

    /**
     * Deletes refresh tokens according to the userId
     * 
     * @param {string} id - unique id of the user record
     * @returns {Promise<void>}
     */
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