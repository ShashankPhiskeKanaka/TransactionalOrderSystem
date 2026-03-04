import { prisma } from "../../db/prisma.js";
import { productMethodsClass, type productType, type provideProductType } from "./product.methods.js";
import { Decimal } from "@prisma/client/runtime/client";

class productPgRepositoryClass extends productMethodsClass {
    create = async (data: provideProductType): Promise<any> => {
        const newProduct = await prisma.products.create({
            data : {
                name : data.name,
                price : Decimal(data.price),
                stock : data.stock,
            }
        });

        return newProduct;
    }

    get = async (id: string): Promise<productType> => {
        const product = await prisma.products.findFirst({
            where : {
                id: id,
                deletedAt : null
            }
        });

        return product ?? <productType>{};
    }

    getAll = async () : Promise<productType[]> => {
        const products = await prisma.products.findMany({
            where : {
                deletedAt : null
            }
        });

        return products;
    }

    update = async (data: productType): Promise<productType> => {
        const product = await prisma.products.update({
            where : {
                id: data.id,
                deletedAt : null
            },
            data
        });

        return product;
    }

    incrementQuantity = async (data: any) : Promise<productType> => {
        return await prisma.$transaction(async (tx) => {
            const product = await tx.products.update({
                where : {
                    id: data.id,
                    deletedAt: null
                },
                data: {
                    stock : { increment: data.quantity }
                }
            });

            return product
        })
    }

    decrementQuantity = async (data: any) : Promise<productType> => {
        return await prisma.$transaction(async (tx) => {
            const product = await tx.products.update({
                where : {
                    id: data.id,
                    deletedAt: null
                },
                data: {
                    stock : { decrement: data.quantity }
                }
            });

            return product
        })    
    }

    delete = async (id: string): Promise<productType> => {
        const product = await prisma.products.update({
            where : {
                id: id,
                deletedAt : null
            },
            data : {
                deletedAt : new Date()
            }
        });

        return product;
    }
}

export { productPgRepositoryClass }