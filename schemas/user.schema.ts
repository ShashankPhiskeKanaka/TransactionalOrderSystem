import z from "zod"
import { errorMessage } from "../constants/error.messages.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

const createUserSchema = z.object({
    body : z.object({
        name : z.string({ error : errorMessage.INVALIDDATA.message }).trim(),
        email : z.string({ error : errorMessage.INVALIDDATA.message }).trim().regex(emailRegex, { error: errorMessage.INVALIDDATA.message }),
        password : z.string({ error: errorMessage.INVALIDDATA.message }).trim().regex(passRegex, { error : errorMessage.INVALIDDATA.message }),
    })
});

export { createUserSchema }