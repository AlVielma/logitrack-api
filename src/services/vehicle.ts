import prisma from "../configs/database";
import { Response } from "../interfaces/response";

export class VehicleService {
    static async create(data: any): Promise<Response> {
        const { plate, brand, model, capacity, vehicleConfiguration, sctPermit, insuranceCompany, insurancePolicy, photoUrls } = data;

        const existingPlate = await prisma.vehicle.findUnique({ where: { plate } });
        if (existingPlate) {
            return { success: false, message: "Plate is already registered", statusCode: 400 };
        }

        const vehicleData: any = {
            plate,
            brand,
            model,
            capacity: capacity ? parseFloat(capacity) : null,
            vehicleConfiguration,
            sctPermit,
            insuranceCompany,
            insurancePolicy
        };

        if (photoUrls && photoUrls.length > 0) {
            vehicleData.photos = {
                create: photoUrls.map((url: string) => ({ url }))
            };
        }

        const vehicle = await prisma.vehicle.create({
            data: vehicleData,
            include: { photos: true }
        });

        return { success: true, message: "Vehicle created successfully", statusCode: 201, data: vehicle };
    }

    static async getAll(page: number = 1, limit: number = 10, search: string = ""): Promise<Response> {
        const skip = (page - 1) * limit;
        const where = search ? { 
            OR: [
                { plate: { contains: search, mode: "insensitive" as any } },
                { brand: { contains: search, mode: "insensitive" as any } },
                { model: { contains: search, mode: "insensitive" as any } }
            ]
        } : {};

        const [total, vehicles] = await prisma.$transaction([
            prisma.vehicle.count({ where }),
            prisma.vehicle.findMany({ 
                where, 
                skip, 
                take: limit,
                include: { photos: true }
            })
        ]);

        return { 
            success: true, 
            message: "Vehicles retrieved successfully", 
            statusCode: 200, 
            data: { data: vehicles, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } } 
        };
    }

    static async getById(id: number): Promise<Response> {
        const vehicle = await prisma.vehicle.findUnique({ 
            where: { id },
            include: { photos: true }
        });
        if (!vehicle) return { success: false, message: "Vehicle not found", statusCode: 404 };
        return { success: true, message: "Vehicle retrieved successfully", statusCode: 200, data: vehicle };
    }

    static async update(id: number, data: any): Promise<Response> {
        const existingVehicle = await prisma.vehicle.findUnique({ where: { id } });
        if (!existingVehicle) return { success: false, message: "Vehicle not found", statusCode: 404 };

        if (data.plate && data.plate !== existingVehicle.plate) {
            const plateInUse = await prisma.vehicle.findUnique({ where: { plate: data.plate } });
            if (plateInUse) return { success: false, message: "Plate is already registered", statusCode: 400 };
        }

        const { photoUrls, capacity, ...updateData } = data;

        if (capacity !== undefined) {
             updateData.capacity = capacity ? parseFloat(capacity) : null;
        }

        const photosConfig = photoUrls && photoUrls.length > 0 ? {
            create: photoUrls.map((url: string) => ({ url }))
        } : undefined;

        const updated = await prisma.vehicle.update({
            where: { id },
            data: {
                ...updateData,
                ...(photosConfig && { photos: photosConfig })
            },
            include: { photos: true }
        });

        return { success: true, message: "Vehicle updated successfully", statusCode: 200, data: updated };
    }

    static async toggleActive(id: number): Promise<Response> {
        const vehicle = await prisma.vehicle.findUnique({ where: { id } });
        if (!vehicle) return { success: false, message: "Vehicle not found", statusCode: 404 };

        const updated = await prisma.vehicle.update({
            where: { id },
            data: { isActive: !vehicle.isActive }
        });

        return { success: true, message: `Vehicle ${updated.isActive ? 'activated' : 'deactivated'}`, statusCode: 200, data: updated };
    }
}