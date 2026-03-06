import { prisma } from "../../db/prisma.js";

class roomPgRepositoryClass {
    create = async (name : string) => {
        const room = await prisma.rooms.create({
            data: {
                name : name
            },
        });

        return room;
    }

    addUser = async ( roomId : string, userId: string ) => {
        const data = await prisma.rooms.update({
            where : { id: roomId },
            data : {
                members : {
                    connect : { id: userId }
                }
            }
        });

        return data;
    }

    removeUser = async ( roomId: string, userId : string ) => {
        const data = await prisma.rooms.update({
            where : { id: roomId },
            data : {
                members: {
                    disconnect : { id: userId }
                }
            }
        });

        return data;
    }
}

export { roomPgRepositoryClass }