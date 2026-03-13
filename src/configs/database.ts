import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}
// el pool es el puente entre la aplicación y la base de datos, manejando las conexiones de manera eficiente
const pool = new Pool({ connectionString });
// el adapter es el puente entre prisma y postgres, utilizando el pool para manejar las conexiones
const adapter = new PrismaPg(pool);
// el cliente de prisma es el punto de entrada para interactuar con la base de datos
const prisma = new PrismaClient({ adapter });


export default prisma;