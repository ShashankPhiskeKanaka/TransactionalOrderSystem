import { errorMessage } from "../../constants/error.messages.js";
import { prisma } from "../../db/prisma.js";
import { serverError } from "../../utils/error.utils.js";
import type { userAuthType } from "../user.repository/user.methods.js";
import { orderMethodsClass, type orderType, type provideOrderType } from "./order.methods.js";
import { Decimal } from "@prisma/client/runtime/client";

class orderPgRepositoryClass extends orderMethodsClass {
    create = async ( data : any ) : Promise<any> => {

        const totalAmount = data.cartItems.reduce((sum : any, item : any) => { return sum + (item.price*item.quantity) }, 0)
        return await prisma.$transaction(async (tx) => {

            const walletData = await tx.$queryRaw<any>`
                SELECT * FROM "wallets"
                WHERE "userId" = ${data.userId} AND ( "deletedAt" IS NULL )
                FOR UPDATE
            `
            const wallet = walletData[0]

            if (!wallet) throw new serverError(errorMessage.NOTFOUND);
            if (wallet.balance < totalAmount) throw new serverError(errorMessage.NOTBALANCE);

            for (const item of data.cartItems) {
                const updatedProduct = await tx.products.updateMany({
                    where : {
                        id: item.productId,
                        stock: { gte : item.quantity },
                        deletedAt : null
                    },
                    data : {
                        stock: { decrement: item.quantity }
                    }
                });

                if(updatedProduct.count == 0) throw new serverError(errorMessage.OUTOFSTOCK);
            }
            const updatedWallet = await tx.wallets.updateMany({
                where: {
                    id: wallet.id
                },
                data : {
                    balance : { decrement : totalAmount }
                }
            });

            await tx.walletTransactions.create({
                data: {
                    walletId : wallet?.id ?? "",
                    amount : totalAmount,
                    type: 'DEBIT'
                }
            });

            const order = await tx.orders.create({
                data: {
                    userId : data.userId,
                }
            });

            await tx.orderItems.createMany({
                data: data.cartItems.map( (item: any) => ({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    purchasedPrice: item.price,
                }))
            })

            return order;
        }, {
            timeout : 10000
        })
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