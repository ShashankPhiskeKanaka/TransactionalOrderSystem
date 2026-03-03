import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg"
import dotenv from "dotenv"

dotenv.config();

const pool = new pg.Pool({
    connectionString : process.env.DATABASE_URL
})

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const connectPrisma = async () => {
  try{
    await prisma.$connect();
    console.log("connected");
    
  }catch (err) {
    console.log(err);
  }
}

export { prisma, connectPrisma }