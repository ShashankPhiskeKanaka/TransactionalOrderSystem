import { activityMessagesClass } from "../constants/activity.messages.js";
import { errorMessage } from "../constants/error.messages.js";
import type { orderPgRepositoryClass } from "../repositories/order.repository/order.pgrepository.js";
import type { userAuthType } from "../repositories/user.repository/user.methods.js";
import { serverError } from "../utils/error.utils.js";
import { logUtil } from "../utils/log.utils.js";
import logger from "../utils/logger.js";

const activityMessage  = new activityMessagesClass("Order");

class orderServicesClass {
    constructor ( private orderMethods : orderPgRepositoryClass ) {}

    create  = async ( data : any, userData: any ) => {

        logger.info("Order creation process started");
        const order = await this.orderMethods.create({
            userId: userData.id,
            role: userData.role,
            ...data
        });

        logger.info("New order created successfully", { orderId: order.id });
        return order;
    }

    get = async ( id: string, userData: userAuthType ) => {

        logger.info("Fetching order process started", { orderId: id });

        const order = await this.orderMethods.get(id, userData);
        if(!order.id){
            logger.warn("Fetching order failed: No order available with the provided id", { orderId: id });
            throw new serverError(errorMessage.NOTFOUND);
        }
        
        logger.info("Order fetched successfully", { orderId: id });

        return order;
    }

    delete = async ( id: string, userData: userAuthType ) => {

        logger.info("Order deletion started", { orderId : id, userId: userData.id });

        const order = await this.orderMethods.delete(id, userData);
        if(!order.id){
            logger.warn("Order deletion failed : No order found", { orderId : id, userId: userData.id });
            throw new serverError(errorMessage.NOTFOUND)
        }

        logger.info("Order deletion successful", { orderId: id, userId: userData.id });
        return order;
    }
}

export { orderServicesClass };