import z from "zod"
import { errorMessage } from "../constants/error.messages.js"

const fetchWalletSchema = z.object({
    body : z.object({
        id : z.string({ error : errorMessage.INVALIDDATA.message })
    })
})

export { fetchWalletSchema }