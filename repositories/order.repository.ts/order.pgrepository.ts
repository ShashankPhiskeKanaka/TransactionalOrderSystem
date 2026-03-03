import { prisma } from "../../db/prisma.js";
import type { userAuthType } from "../user.repository.ts/user.methods.js";
import { orderMethodsClass, type orderType, type provideOrderType } from "./order.methods.js";

class orderPgRepositoryClass extends orderMethodsClass {
    create = async ( data : provideOrderType, userData : userAuthType ) : Promise<orderType> => {
        const newOrder = await prisma.orders.create({
            data : {
                ...data,
                userId : userData.id!
            }
        });

        return newOrder;
    }

    get = async ( id : string, userData : userAuthType ) : Promise<orderType> => {
        const where : any = {
            id: id,
            deletedAt : null
        }

        if(userData.role !== 'ADMIN') {
            where.userId = userData.id;
        }

        const order = await prisma.orders.findFirst({
            where: where,
            include : {
                orderItems : true,
                user: {
                    select : { name : true, email : true }
                }
            }
        });

        return order ?? <orderType>{};
    }

    getAll = async (limit: number | undefined, search: string | undefined, sort: string | undefined, lastCreatedAt : string | undefined, lastId : string | undefined, userData : userAuthType ) : Promise<orderType[]> => {
        const where : any = {
            deletedAt : null
        }

        if(userData.role !== 'ADMIN') {
            where.userId = userData.id;
        }
        
        const orders = await prisma.orders.findMany({
            where : where,
            include: {
                orderItems : true,
                user: {
                    select : { name: true, email: true }
                }
            }
        });

        return orders;
    }

    delete = async ( id: string, userData : userAuthType ) : Promise<orderType> => {
        const where : any = {
            id: id,
            deletedAt : null
        }

        if(userData.role !== 'ADMIN') {
            where.userId = userData.id;
        }
        const deletedOrder = await prisma.orders.update({
            where : where,
            data : {
                deletedAt: new Date()
            }
        });

        return deletedOrder ?? <orderType>{};
    }
}

export { orderPgRepositoryClass }