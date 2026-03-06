import { prisma } from "../../db/prisma.js"

class messagePgRepositoryClass {
    create = async ( data : any ) : Promise<any> => {
        const message = await prisma.messages.create({
            data : data,
            include : {
                sender : { select : { name: true, email : true } }
            }
        });

        return message;
    }

    getChatHistory = async ( userA: string, userB : string ) => {
        const messages = await prisma.messages.findMany({
            where : {
                OR : [
                    { from : userA, to : userB, deletedAt: null },
                    { from : userB, to: userA, deletedAt : null }
                ]
            },
            orderBy : { createdAt : "desc" },
            take : 50
        });

        return messages;
    }
}

export { messagePgRepositoryClass }