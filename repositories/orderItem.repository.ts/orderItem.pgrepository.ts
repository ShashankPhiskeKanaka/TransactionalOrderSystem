import { prisma } from "../../db/prisma.js";
import { Prisma } from "../../generated/prisma/client.js";
import { orderItemsMethodClass, type orderItemType, type provideOrderItemType } from "./orderItem.methods.js";

class orderItemsPgRepositoryClass extends orderItemsMethodClass {
    create = async (data: provideOrderItemType): Promise<orderItemType> => {
        const newOrderItems = await prisma.orderItems.create({
            data: {
                items : data.items as Prisma.InputJsonValue,
                order: {
                    connect: { id: data.orderId }
                }
            }
        });

        return newOrderItems;
    }

    get = async (id: string): Promise<orderItemType> => {
        const orderItems = await prisma.orderItems.findFirst({
            where: {
                id: id,
                deletedAt : null
            },
        });

        return orderItems ?? <orderItemType> {};
    }

    getAll = async (): Promise<orderItemType[]> => {
        const orderItems = await prisma.orderItems.findMany({
            where: {
                deletedAt : null
            }
        });

        return orderItems;
    }

    update = async (data: orderItemType): Promise<orderItemType> => {
        const orderItems = await prisma.orderItems.update({
            where: {
                id: data.id,
                deletedAt: null
            },
            data: {
                items: data.items as Prisma.InputJsonValue
            }
        });

        return orderItems;
    }

    delete = async (id: string): Promise<orderItemType> => {
        const orderItems = await prisma.orderItems.update({
            where : {
                id: id,
                deletedAt: null
            },
            data : {
                deletedAt : new Date()
            }
        });

        return orderItems;
    }
}

export { orderItemsPgRepositoryClass }