import { messagePgRepositoryClass } from "../repositories/message.repository/message.pgrepository.js";
import { serverError } from "../utils/error.utils.js";

class MessageServiceClass {

    constructor ( private messageMethods :  messagePgRepositoryClass) {}

    async saveAndDistribute(payload : any, senderId: string ) {
        if (!payload.message) throw new serverError({ status : 400, message : "Empty message" });

        const message = await this.messageMethods.create({
            from : senderId,
            to: payload.to,
            message : payload.message
        });   
        
        return message;
    }

    getHistory = async (userA : string, userB : string) => {
        const messages = await this.messageMethods.getChatHistory(userA, userB);
        return messages;
    }
}

const repo = new messagePgRepositoryClass();
const MessageService = new MessageServiceClass(repo);

export { MessageService, MessageServiceClass }