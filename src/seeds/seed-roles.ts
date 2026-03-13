import prisma from "../configs/database";

export async function seedRoles() {
  const roles = [
    { name: "Admin" },
    { name: "Operator" },
  ];

  try{
    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }
    console.log("Roles seeded successfully");
  } catch (error) {
    console.error("Error seeding roles:", error);
  }

}