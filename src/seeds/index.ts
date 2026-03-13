import prisma  from "../configs/database";
import { seedRoles } from "./seed-roles";
import { seedUsers } from "./seed-users";

async function main() {
    console.log("Starting seeding process...");
    await seedRoles();
    await seedUsers();
    console.log("All seeds executed successfully");
}
  
main()
    //manejo de errores en caso de que ocurra un error durante la ejecución de las semillas 
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    //cierra conexion a la base de datos (exito o error)
    .finally(async () => {
      await prisma.$disconnect();
    });
  