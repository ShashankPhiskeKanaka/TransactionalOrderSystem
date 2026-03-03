interface tokenType {
    id? : string
    userId? : string
    familyId? : string
    createdAt? : Date
    used? : boolean
}

abstract class authMethodsClass {
    abstract create ( data: tokenType ) : Promise<tokenType>;
    abstract get ( id: string, userId: string ) : Promise<tokenType>;
    abstract update ( id: string, userId: string ) : void;
    abstract deleteByUser ( id: string ) : void;
    abstract deleteByFamily ( id: string ) : void;
}

export { authMethodsClass }
export type { tokenType }