import type { Decimal } from "@prisma/client/runtime/client";
import type { userAuthType } from "../user.repository.ts/user.methods.js";

interface walletType {
    id : string,
    userId : string,
    balance : Decimal,
    createdAt : Date,
    deletedAt : Date | null
}

interface provideWalletType{
    userId : string
}

abstract class walletMethodsClass {
    abstract create ( data: walletType, userData: userAuthType ) : Promise<walletType>;
    abstract get ( id: string, userData: userAuthType ) : Promise<walletType>;
    abstract getAll () : Promise<walletType[]>;
    abstract update ( data: walletType, userData: userAuthType ) : Promise<walletType>;
    abstract delete ( id: string, userData: userAuthType ) : Promise<walletType>;
}

export { walletMethodsClass }
export type { walletType, provideWalletType }