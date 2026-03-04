import type { JsonValue } from "@prisma/client/runtime/client"
import { Decimal } from "@prisma/client/runtime/client"

interface orderItemType {
    id : string,
    orderId : string,
    productId : string,
    quantity : number,
    purchasedPrice : Decimal,
    createdAt : Date,
    deletedAt : Date | null
}

interface provideOrderItemType {
    productId : string,
    quantity : number,
    purchasedPrice : Decimal,
    orderId: string,
}

abstract class orderItemsMethodClass {
    abstract create ( data: orderItemType ) : Promise<orderItemType>;
    abstract get ( id: string ) : Promise<orderItemType>;
    abstract getAll () : Promise<orderItemType[]>;
    abstract delete ( id: string ) : Promise<orderItemType>;
}

export { orderItemsMethodClass }
export type { orderItemType, provideOrderItemType }