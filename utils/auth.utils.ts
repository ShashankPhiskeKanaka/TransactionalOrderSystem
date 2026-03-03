import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class authUtilsClass {
    comparePasswords = async (password: string, hashedPassword: string) => {
        return bcrypt.compare(password, hashedPassword);
    }

    generateAccessToken = ( id: string, role: string ) => {
        return jwt.sign({ id, role }, process.env.JWTSECRET as string, { expiresIn : "15m" });
    }

    generateForgetToken = ( id: string ) => {
        return jwt.sign({ id }, process.env.JWTSECRET as string, { expiresIn: "15m" });
    }

    decodeForgetToken = (token : string) => {
        return jwt.verify(token, process.env.JWTSECRET as string) as { id: string }
    }

    decodeAccesstoken = (token : string) => {
        return jwt.verify(token, process.env.JWTSECRET as string) as { id: string, role: string }
    }

    hashPassword = async ( password : string ) => {
        return await bcrypt.hash(password, 10);
    }
}

export { authUtilsClass }