import type { userAuthType } from "../user.repository.ts/user.methods.js"

interface orderType {
    id : string
    userId : string
    createdAt : Date
    deletedAt : Date | null
}

interface provideOrderType {
    userId: string
}

abstract class orderMethodsClass {
    abstract create ( data : provideOrderType, userData : userAuthType ) : Promise<orderType>;
    abstract get ( id : string, userData : userAuthType ) : Promise<orderType>;
    abstract getAll ( limit: number | undefined, search: string | undefined, sort: string | undefined, lastCreatedAt : string | undefined, lastId : string | undefined, userData : userAuthType ) : Promise<orderType[]>;
    abstract delete ( id: string, userData : userAuthType ) : Promise<orderType>;
}

export { orderMethodsClass }
export type { orderType, provideOrderType }