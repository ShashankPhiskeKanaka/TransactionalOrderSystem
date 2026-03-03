import z from "zod"
import { errorMessage } from "../constants/error.messages.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

const loginSchema = z.object({
    body : z.object({
        email : z.string({ error : errorMessage.INVALIDDATA.message }).trim().regex(emailRegex, { error: errorMessage.INVALIDDATA.message }),
        password : z.string({ error: errorMessage.INVALIDDATA.message }).trim().regex(passRegex, { error : errorMessage.INVALIDDATA.message }),
    })
});

const forgetPasswordSchema = z.object({
    params: z.object({
        email : z.string({ error : errorMessage.INVALIDDATA.message }).trim().regex(emailRegex, { error: errorMessage.INVALIDDATA.message }),
    })
})

const changePasswordSchema = z.object({
    body : z.object({
        password : z.string({ error: errorMessage.INVALIDDATA.message }).trim().regex(passRegex, { error : errorMessage.INVALIDDATA.message }),
    }),
    params: z.object({
        token : z.string( { error : errorMessage.INVALIDDATA.message }).trim()
    })
})

export { loginSchema, forgetPasswordSchema, changePasswordSchema }