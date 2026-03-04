import { activityMessagesClass } from "../constants/activity.messages.js";
import { errorMessage } from "../constants/error.messages.js";
import type { productPgRepositoryClass } from "../repositories/product.repository/product.pgrepository.js"
import { serverError } from "../utils/error.utils.js";

const activityMessage = new activityMessagesClass("Product");

class productServicesClass {
    constructor ( private productMethods : productPgRepositoryClass ) {};

    create = async (data : any) => {
        const product = await this.productMethods.create(data);
        activityMessage.CREATED;
        return product;
    }

    get = async ( id: string ) => {
        const product = await this.productMethods.get(id);
        if(!product.id) throw new serverError(errorMessage.NOTFOUND);
        activityMessage.FETCHED;
        return product;
    }

    getAll = async () => {
        const products = await this.productMethods.getAll();
        activityMessage.FETCHEDALL;
        return products;
    }

    update = async (data : any) => {
        const product = await this.productMethods.update(data);
        if(!product.id) throw new serverError(errorMessage.NOTFOUND);
        activityMessage.UPDATED;
        return product;
    }

    incrementQuantity = async ( data : any ) => {
        const product = await this.productMethods.incrementQuantity(data);
        if(!product.id) throw new serverError(errorMessage.NOTFOUND);
        activityMessage.UPDATED;
        return product;
    }

    decrementQuantity = async ( data : any ) => {
        const product = await this.productMethods.decrementQuantity(data);
        if(!product.id) throw new serverError(errorMessage.NOTFOUND);
        activityMessage.UPDATED;
        return product;
    }

    delete = async ( id: string ) => {
        const product = await this.productMethods.delete(id);
        if(!product.id) throw new serverError(errorMessage.NOTFOUND);
        activityMessage.DELETED;
        return product;        
    }
}

export { productServicesClass }