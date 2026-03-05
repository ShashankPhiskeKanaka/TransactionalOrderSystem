import z from "zod"
import { errorMessage } from "../constants/error.messages.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

const createUserSchema = z.object({
    body : z.object({
        name : z.string({ error : errorMessage.INVALIDDATA.message }),
        email : z.string({ error : errorMessage.INVALIDDATA.message }).regex(emailRegex, { error: errorMessage.INVALIDDATA.message }),
        password : z.string({ error: errorMessage.INVALIDDATA.message }).regex(passRegex, { error : errorMessage.INVALIDDATA.message }),
    })
});

const updateUserSchema = z.object({
    body : z.object({
        name : z.string({ error : errorMessage.INVALIDDATA.message }).trim().optional(),
        email : z.string({ error : errorMessage.INVALIDDATA.message }).trim().regex(emailRegex, { error: errorMessage.INVALIDDATA.message }).optional(),
        password : z.string({ error: errorMessage.INVALIDDATA.message }).trim().regex(passRegex, { error : errorMessage.INVALIDDATA.message }).optional(),
    })
});

export { createUserSchema, updateUserSchema }