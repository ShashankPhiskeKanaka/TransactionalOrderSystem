import type { Decimal } from "@prisma/client/runtime/client"

interface productType {
    id : string
    name : string
    price : Decimal
    stock : number
    createdAt : Date
    deletedAt : Date | null
}

interface provideProductType {
    name: string
    price: Decimal
    stock: number
}

abstract class productMethodsClass {
    abstract create ( data : productType ) : Promise<productType>;
    abstract get ( id: string ) : Promise<productType>;
    abstract getAll () : Promise<productType[]>;
    abstract update ( data: productType ) : Promise<productType>;
    abstract delete (id: string) : Promise<productType>;
}

export { productMethodsClass }
export type { productType, provideProductType }