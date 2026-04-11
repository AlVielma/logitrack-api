import prisma from "../configs/database";
import { Response } from "../interfaces/response";

export class DriverService {
    static async create(data: any): Promise<Response> {
        const existingRfc = await prisma.driver.findUnique({ where: { rfc: data.rfc } });
        if (existingRfc) return { success: false, message: "RFC is already in use", statusCode: 400 };

        const existingCurp = await prisma.driver.findUnique({ where: { curp: data.curp } });
        if (existingCurp) return { success: false, message: "CURP is already in use", statusCode: 400 };

        const existingLicense = await prisma.driver.findUnique({ where: { sctLicense: data.sctLicense } });
        if (existingLicense) return { success: false, message: "SCT License is already in use", statusCode: 400 };

        const driver = await prisma.driver.create({ data });
        return { success: true, message: "Driver created successfully", statusCode: 201, data: driver };
    }

    static async getAll(page: number = 1, limit: number = 10, search: string = ""): Promise<Response> {
        const skip = (page - 1) * limit;
        const where = search ? { firstName: { contains: search, mode: "insensitive" as any } } : {};

        const [total, drivers] = await prisma.$transaction([
            prisma.driver.count({ where }),
            prisma.driver.findMany({ where, skip, take: limit })
        ]);

        return { 
            success: true, 
            message: "Drivers retrieved successfully", 
            statusCode: 200, 
            data: { data: drivers, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } } 
        };
    }

    static async getById(id: number): Promise<Response> {
        const driver = await prisma.driver.findUnique({ where: { id } });
        if (!driver) return { success: false, message: "Driver not found", statusCode: 404 };
        return { success: true, message: "Driver retrieved successfully", statusCode: 200, data: driver };
    }

    static async update(id: number, data: any): Promise<Response> {
        const existingDriver = await prisma.driver.findUnique({ where: { id } });
        if (!existingDriver) return { success: false, message: "Driver not found", statusCode: 404 };

        if (data.rfc && data.rfc !== existingDriver.rfc) {
            const rfcInUse = await prisma.driver.findUnique({ where: { rfc: data.rfc } });
            if (rfcInUse) return { success: false, message: "RFC is already in use", statusCode: 400 };
        }

        if (data.curp && data.curp !== existingDriver.curp) {
            const curpInUse = await prisma.driver.findUnique({ where: { curp: data.curp } });
            if (curpInUse) return { success: false, message: "CURP is already in use", statusCode: 400 };
        }

        if (data.sctLicense && data.sctLicense !== existingDriver.sctLicense) {
            const licenseInUse = await prisma.driver.findUnique({ where: { sctLicense: data.sctLicense } });
            if (licenseInUse) return { success: false, message: "SCT License is already in use", statusCode: 400 };
        }

        const updated = await prisma.driver.update({ where: { id }, data });
        return { success: true, message: "Driver updated successfully", statusCode: 200, data: updated };
    }

    static async toggleActive(id: number): Promise<Response> {
        const driver = await prisma.driver.findUnique({ where: { id } });
        if (!driver) return { success: false, message: "Driver not found", statusCode: 404 };

        const updated = await prisma.driver.update({
            where: { id },
            data: { isActive: !driver.isActive }
        });

        return { success: true, message: `Driver ${updated.isActive ? 'activated' : 'deactivated'}`, statusCode: 200, data: updated };
    }
}