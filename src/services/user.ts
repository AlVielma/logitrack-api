import prisma from "../configs/database";
import { Response } from "../interfaces/response";
import { hashPassword } from "../utils/password";

export class UserService {
    static async create(data: any): Promise<Response> {
        const { email, password, firstName, lastName, roleId, phone } = data;
        
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            return { success: false, message: "Email is already in use", statusCode: 400 };
        }

        const existinRole = await prisma.role.findUnique({ where: { id: roleId } });
        if (!existinRole) {
            return { success: false, message: "Role not found", statusCode: 404 };
        }

        const hashedPassword = await hashPassword(password);
        
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, firstName, lastName, roleId, phone }
        });

        const { password: _, ...userWithoutPassword } = user;
        return { success: true, message: "User created successfully", statusCode: 201, data: userWithoutPassword };
    }

    static async getAll(page: number = 1, limit: number = 10, search: string = ""): Promise<Response> {
        const skip = (page - 1) * limit;
        const where = search ? { firstName: { contains: search, mode: "insensitive" as any } } : {};

        const [total, users] = await prisma.$transaction([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: { id: true, email: true, firstName: true, lastName: true, roleId: true, phone: true, photoUrl: true, isActive: true, role: true }
            })
        ]);

        return { 
            success: true, 
            message: "Users retrieved successfully", 
            statusCode: 200, 
            data: { data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } } 
        };
    }

    static async getById(id: number): Promise<Response> {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, firstName: true, lastName: true, roleId: true, phone: true, photoUrl: true, isActive: true, role: true }
        });
        
        if (!user) return { success: false, message: "User not found", statusCode: 404 };
        return { success: true, message: "User retrieved successfully", statusCode: 200, data: user };
    }

    static async update(id: number, data: any): Promise<Response> {
        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) return { success: false, message: "User not found", statusCode: 404 };

        if (data.email && data.email !== existingUser.email) {
            const emailInUse = await prisma.user.findUnique({ where: { email: data.email } });
            if (emailInUse) return { success: false, message: "Email is already in use", statusCode: 400 };
        }

        const updatedData = { ...data };
        if (data.password) updatedData.password = await hashPassword(data.password);

        const updated = await prisma.user.update({
            where: { id },
            data: updatedData,
            select: { id: true, email: true, firstName: true, lastName: true, roleId: true, phone: true, isActive: true }
        });

        return { success: true, message: "User updated successfully", statusCode: 200, data: updated };
    }

    static async toggleActive(id: number): Promise<Response> {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return { success: false, message: "User not found", statusCode: 404 };

        const updated = await prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: { id: true, email: true, firstName: true, lastName: true, isActive: true }
        });

        return { success: true, message: `User ${updated.isActive ? 'activated' : 'deactivated'}`, statusCode: 200, data: updated };
    }
}