import { errorMessage } from "../../constants/error.messages.js";
import { prisma } from "../../db/prisma.js";
import { serverError } from "../../utils/error.utils.js";
import { userMethodsClass, type provideUserType, type userType } from "./user.methods.js";

class userPgRepositoryClass extends userMethodsClass {
    create = async ( data : provideUserType ) : Promise<any> => {
        return await prisma.$transaction(async (tx) => {
            try{
                const newUser = await tx.users.create({
                    data : {
                        name : data.name,
                        email : data.email,
                        password: data.password,
                    }
                });

                const newWallet = await tx.wallets.create({
                    data: {
                        user: {
                            connect: { id: newUser.id ?? "" }
                        }
                    }
                });

                return { user: newUser, wallet : newWallet };
            } catch (err : any) {
                if(err.code == 'P2002'){
                    throw new serverError(errorMessage.EXISTS);
                }

                throw err;
            }
        });
    }

    get = async ( id: string ) : Promise<userType> => {
        const user = await prisma.users.findFirst({
            where : {
                id: id,
                deletedAt: null
            },
            include : {
                wallet : true,
                orders : true
            }
        });

        return user ?? <userType>{};
    }

    getByMail = async ( email : string ) : Promise<userType> => {
        const user = await prisma.users.findFirst({
            where: {
                email : email,
                deletedAt : null
            }
        });

        return user ?? <userType>{};
    }

    getAll = async () : Promise<userType[]> => {
        const users = await prisma.users.findMany({
            where: {
                deletedAt : null
            },
            include : {
                wallet : true,
                orders : true
            }
        });

        return users;
    }

    update = async (data: any): Promise<userType> => {
        const user = await prisma.users.update({
            where : {
                id: data.id,
                deletedAt : null
            },
            data : data
        });

        return user;
    }

    delete = async ( id: string ) : Promise<userType> => {
        const user = await prisma.users.update({
            where : {
                id: id,
                deletedAt: null
            },
            data : {
                deletedAt : new Date(),
                email : id
            }
        });

        return user;
    }
}

export { userPgRepositoryClass }