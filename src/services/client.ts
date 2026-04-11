import prisma from "../configs/database";
import { Response } from "../interfaces/response";

export class ClientService {
    static async create(data: any): Promise<Response> {
        const existingRfc = await prisma.client.findUnique({ where: { rfc: data.rfc } });
        if (existingRfc) {
            return { success: false, message: "RFC is already in use", statusCode: 400 };
        }

        const client = await prisma.client.create({ data });
        return { success: true, message: "Client created successfully", statusCode: 201, data: client };
    }

    static async getAll(page: number = 1, limit: number = 10, search: string = ""): Promise<Response> {
        const skip = (page - 1) * limit;
        const where = search ? { businessName: { contains: search, mode: "insensitive" as any } } : {};

        const [total, clients] = await prisma.$transaction([
            prisma.client.count({ where }),
            prisma.client.findMany({ where, skip, take: limit })
        ]);

        return { 
            success: true, 
            message: "Clients retrieved successfully", 
            statusCode: 200, 
            data: { data: clients, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } } 
        };
    }

    static async getById(id: number): Promise<Response> {
        const client = await prisma.client.findUnique({ where: { id } });
        if (!client) return { success: false, message: "Client not found", statusCode: 404 };
        return { success: true, message: "Client retrieved successfully", statusCode: 200, data: client };
    }

    static async update(id: number, data: any): Promise<Response> {
        const existingClient = await prisma.client.findUnique({ where: { id } });
        if (!existingClient) return { success: false, message: "Client not found", statusCode: 404 };

        if (data.rfc && data.rfc !== existingClient.rfc) {
            const rfcInUse = await prisma.client.findUnique({ where: { rfc: data.rfc } });
            if (rfcInUse) return { success: false, message: "RFC is already in use", statusCode: 400 };
        }

        const updated = await prisma.client.update({ where: { id }, data });
        return { success: true, message: "Client updated successfully", statusCode: 200, data: updated };
    }

    static async toggleActive(id: number): Promise<Response> {
        const client = await prisma.client.findUnique({ where: { id } });
        if (!client) return { success: false, message: "Client not found", statusCode: 404 };

        const updated = await prisma.client.update({
            where: { id },
            data: { isActive: !client.isActive }
        });

        return { success: true, message: `Client ${updated.isActive ? 'activated' : 'deactivated'}`, statusCode: 200, data: updated };
    }
}