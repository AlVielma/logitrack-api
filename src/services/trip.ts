import prisma from "../configs/database";
import { Response } from "../interfaces/response";
import { TripStatus, DriverStatus, VehicleStatus } from "@prisma/client";

export class TripService {
    static async create(data: any): Promise<Response> {
        const { origin, originZipCode, destination, destZipCode, clientId, driverId, vehicleId, operatorId, scheduledDate, price, cartaPorteUuid } = data;

        // Validar existencias foráneas
        const [client, driver, vehicle] = await Promise.all([
            prisma.client.findUnique({ where: { id: clientId } }),
            prisma.driver.findUnique({ where: { id: driverId } }),
            prisma.vehicle.findUnique({ where: { id: vehicleId } })
        ]);

        if (!client) return { success: false, message: "Client not found", statusCode: 404 };
        if (!driver) return { success: false, message: "Driver not found", statusCode: 404 };
        if (!vehicle) return { success: false, message: "Vehicle not found", statusCode: 404 };

        if (!driver.isActive || !vehicle.isActive) {
             return { success: false, message: "Selected Driver or Vehicle are currently inactive", statusCode: 400 };
        }

        const trip = await prisma.trip.create({
            data: {
                origin, originZipCode, destination, destZipCode, clientId, driverId, vehicleId, operatorId,
                scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
                price: price ? parseFloat(price) : null,
                cartaPorteUuid,
                status: TripStatus.PENDING
            },
            include: { client: true, driver: true, vehicle: true }
        });

        return { success: true, message: "Trip created successfully", statusCode: 201, data: trip };
    }

    static async getAll(page: number = 1, limit: number = 10, search: string = ""): Promise<Response> {
        const skip = (page - 1) * limit;
        const where = search ? { 
            OR: [
                { origin: { contains: search, mode: "insensitive" as any } },
                { destination: { contains: search, mode: "insensitive" as any } },
                { cartaPorteUuid: { contains: search, mode: "insensitive" as any } }
            ]
        } : {};

        const [total, trips] = await prisma.$transaction([
            prisma.trip.count({ where }),
            prisma.trip.findMany({ 
                where, 
                skip, 
                take: limit,
                include: { 
                    client: { select: { id: true, businessName: true } }, 
                    driver: { select: { id: true, firstName: true, lastName: true } }, 
                    vehicle: { select: { id: true, plate: true } }
                },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return { 
            success: true, 
            message: "Trips retrieved successfully", 
            statusCode: 200, 
            data: { data: trips, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } } 
        };
    }

    static async getById(id: number): Promise<Response> {
        const trip = await prisma.trip.findUnique({ 
            where: { id },
            include: { 
                client: true, 
                driver: true, 
                vehicle: true,
                operator: { select: { id: true, firstName: true, lastName: true, email: true } }
            }
        });
        if (!trip) return { success: false, message: "Trip not found", statusCode: 404 };
        return { success: true, message: "Trip retrieved successfully", statusCode: 200, data: trip };
    }

    static async update(id: number, data: any): Promise<Response> {
        const existingTrip = await prisma.trip.findUnique({ where: { id } });
        if (!existingTrip) return { success: false, message: "Trip not found", statusCode: 404 };

        const updateData: any = { ...data };
        if (data.scheduledDate) updateData.scheduledDate = new Date(data.scheduledDate);
        if (data.price !== undefined) updateData.price = data.price ? parseFloat(data.price) : null;

        const updated = await prisma.trip.update({
            where: { id },
            data: updateData,
            include: { client: true, driver: true, vehicle: true }
        });

        return { success: true, message: "Trip updated successfully", statusCode: 200, data: updated };
    }

    static async updateStatus(id: number, newStatus: TripStatus): Promise<Response> {
        const trip = await prisma.trip.findUnique({ where: { id } });
        if (!trip) return { success: false, message: "Trip not found", statusCode: 404 };
        if (trip.status === newStatus) return { success: false, message: "Trip is already in this status", statusCode: 400 };

        try {
            const updatedTrip = await prisma.$transaction(async (tx) => {
                let driverStatusToSet: DriverStatus | undefined;
                let vehicleStatusToSet: VehicleStatus | undefined;
                let startDate = trip.startDate;
                let endDate = trip.endDate;

                // Transición de Lógica: De PENDING a IN_PROGRESS
                if (newStatus === TripStatus.IN_PROGRESS) {
                    driverStatusToSet = DriverStatus.ON_TRIP;
                    vehicleStatusToSet = VehicleStatus.ON_TRIP;
                    if (!startDate) startDate = new Date();
                } 
                // Transición de Lógica: De IN_PROGRESS a OTRA (COMPLETED/CANCELLED) libera entidades
                else if ((newStatus === TripStatus.COMPLETED || newStatus === TripStatus.CANCELLED) && trip.status === TripStatus.IN_PROGRESS) {
                    driverStatusToSet = DriverStatus.AVAILABLE;
                    vehicleStatusToSet = VehicleStatus.AVAILABLE;
                    if (newStatus === TripStatus.COMPLETED && !endDate) endDate = new Date();
                }

                // 1. Actualizar Viaje
                const updated = await tx.trip.update({
                    where: { id },
                    data: { status: newStatus, startDate, endDate }
                });

                // 2. Liberar o Bloquear Conductor
                if (driverStatusToSet) {
                    await tx.driver.update({
                        where: { id: trip.driverId },
                        data: { status: driverStatusToSet }
                    });
                }

                // 3. Liberar o Bloquear Vehículo
                if (vehicleStatusToSet) {
                    await tx.vehicle.update({
                        where: { id: trip.vehicleId },
                        data: { status: vehicleStatusToSet }
                    });
                }

                return updated;
            });

            return { success: true, message: `Trip status updated to ${newStatus}`, statusCode: 200, data: updatedTrip };
        } catch (error) {
            console.error("Transaction Error:", error);
            return { success: false, message: "Failed to update trip status", statusCode: 500, error: String(error) } as any;
        }
    }
}