import prisma from "../configs/database";
import { hashPassword } from "../utils/password";

export async function seedUsers() {
    const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
    const operatorRole = await prisma.role.findUnique({ where: { name: "Operator" } });

    if (!adminRole || !operatorRole) {
        throw new Error("Roles not found");
    }

    const adminPassword = await hashPassword("Admin123.");
    const operatorPassword = await hashPassword("Operator123.");
    
    await prisma.user.upsert({
        where: { email: "vielma7220@icloud.com" },
        update: {
            firstName: "System",
            lastName: "Admin",
            password: adminPassword,
            roleId: adminRole.id,
            isActive: true,
        },
        create: {
            email: "vielma7220@icloud.com",
            firstName: "System",
            lastName: "Admin",
            password: adminPassword,
            roleId: adminRole.id,
            isActive: true,
        },
    });

    await prisma.user.upsert({
        where: { email: "vielma7220@gmail.com" },
        update: {
            firstName: "System",
            lastName: "Operator",
            password: operatorPassword,
            roleId: operatorRole.id,
            isActive: true,
        },
        create: {
            email: "vielma7220@gmail.com",
            firstName: "System",
            lastName: "Operator",
            password: operatorPassword,
            roleId: operatorRole.id,
            isActive: true,
        },
    });

    console.log("Users seeded successfully");
}