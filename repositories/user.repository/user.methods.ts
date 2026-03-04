interface userAuthType {
    id? : string
    role? : string
}

interface userType {
    id : string
    role : string
    name : string
    email : string
    password : string
    createdAt : Date
    deletedAt : Date | null
    wallet? : any
}

interface provideUserType{
    name: string
    email: string
    password: string
}

abstract class userMethodsClass {
    abstract create ( data : userType ) : Promise<userType>;
    abstract get ( id : string ) : Promise<userType>;
    abstract getAll () : Promise<userType[]>;
    abstract update ( data : userType ) : Promise<userType>;
    abstract delete ( id: string ) : Promise<userType>;
}

export { userMethodsClass }
export type { userAuthType, userType, provideUserType }