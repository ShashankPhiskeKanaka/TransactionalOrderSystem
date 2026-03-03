import { prisma } from "../../db/prisma.js";
import { userMethodsClass, type provideUserType, type userType } from "./user.methods.js";

class userPgRepositoryClass extends userMethodsClass {
    create = async ( data : provideUserType ) : Promise<userType> => {
        const newUser = await prisma.users.create({
            data : data
        });

        return newUser;
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
                deletedAt : new Date()
            }
        });

        return user;
    }
}

export { userPgRepositoryClass }