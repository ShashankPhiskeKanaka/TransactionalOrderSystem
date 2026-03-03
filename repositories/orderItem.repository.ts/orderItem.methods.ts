import type { JsonValue } from "@prisma/client/runtime/client"

interface orderItemType {
    id : string,
    orderId : string,
    items : JsonValue,
    createdAt : Date,
    deletedAt : Date | null
}

interface provideOrderItemType {
    items : JsonValue,
    orderId: string
}

abstract class orderItemsMethodClass {
    abstract create ( data: orderItemType ) : Promise<orderItemType>;
    abstract get ( id: string ) : Promise<orderItemType>;
    abstract getAll () : Promise<orderItemType[]>;
    abstract update ( data: orderItemType ) : Promise<orderItemType>;
    abstract delete ( id: string ) : Promise<orderItemType>;
}

export { orderItemsMethodClass }
export type { orderItemType, provideOrderItemType }