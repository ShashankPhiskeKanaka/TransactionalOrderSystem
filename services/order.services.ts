import { activityMessagesClass } from "../constants/activity.messages.js";
import { errorMessage } from "../constants/error.messages.js";
import type { orderPgRepositoryClass } from "../repositories/order.repository/order.pgrepository.js";
import type { userAuthType } from "../repositories/user.repository/user.methods.js";
import { serverError } from "../utils/error.utils.js";

const activityMessage  = new activityMessagesClass("Order");

class orderServicesClass {
    constructor ( private orderMethods : orderPgRepositoryClass ) {}

    create  = async ( data : any, userData: any ) => {
        const order = await this.orderMethods.create({
            userId: userData.id,
            role: userData.role,
            ...data
        });

        activityMessage.CREATED;
        return order;
    }

    get = async ( id: string, userData: userAuthType ) => {
        const order = await this.orderMethods.get(id, userData);
        if(!order.id) throw new serverError(errorMessage.NOTFOUND)
        activityMessage.FETCHED;

        return order;
    }

    delete = async ( id: string, userData: userAuthType ) => {
        const order = await this.orderMethods.delete(id, userData);
        if(!order.id) throw new serverError(errorMessage.NOTFOUND)
        activityMessage.DELETED;
        return order;
    }
}

export { orderServicesClass };