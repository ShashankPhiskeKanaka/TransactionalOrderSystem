import z from "zod";
import { errorMessage } from "../constants/error.messages.js";

const ordersAt = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

const ordersAtSchema = z.object({
    params : z.object({
        date : z.string({ error : errorMessage.INVALIDDATA.message }).regex(ordersAt, { error : errorMessage.INVALIDDATA.message })
    })
})

const ordersInRangeSchema = z.object({
    query : z.object({
        start : z.string({ error : errorMessage.INVALIDDATA.message }).regex(ordersAt, { error : errorMessage.INVALIDDATA.message }),
        end : z.string({ error : errorMessage.INVALIDDATA.message }).regex(ordersAt, { error : errorMessage.INVALIDDATA.message })
    })
})

export { ordersAtSchema, ordersInRangeSchema }