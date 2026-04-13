import prisma from "../configs/database";
import { Response } from "../interfaces/response";
import { TripStatus, DriverStatus, VehicleStatus } from "@prisma/client";

export class DashboardService {
    static async getSummary(): Promise<Response> {
        try {
            // Ejecutamos múltiples consultas en paralelo para mayor rapidez
            const [
                tripsGrouped,
                driversGrouped,
                vehiclesGrouped,
                revenueAgg,
                activeClientsCount,
                upcomingTrips
            ] = await Promise.all([
                // 1. Conteo de viajes por su estado
                prisma.trip.groupBy({
                    by: ['status'],
                    _count: { id: true }
                }),
                
                // 2. Conteo de conductores (activos) por su estado
                prisma.driver.groupBy({
                    by: ['status'],
                    _count: { id: true },
                    where: { isActive: true }
                }),

                // 3. Conteo de vehículos (activos) por su estado
                prisma.vehicle.groupBy({
                    by: ['status'],
                    _count: { id: true },
                    where: { isActive: true }
                }),

                // 4. Suma de ingresos de viajes completados
                prisma.trip.aggregate({
                    _sum: { price: true },
                    where: { status: TripStatus.COMPLETED }
                }),

                // 5. Total de clientes activos
                prisma.client.count({
                    where: { isActive: true }
                }),

                // 6. Próximos 5 viajes pendientes (ordenados por fecha programada)
                prisma.trip.findMany({
                    where: { status: TripStatus.PENDING },
                    orderBy: { scheduledDate: 'asc' },
                    take: 5,
                    include: {
                        client: { select: { businessName: true } },
                        driver: { select: { firstName: true, lastName: true } },
                        vehicle: { select: { plate: true } }
                    }
                })
            ]);

            // Formatear los datos para que el Frontend los consuma fácilmente
            const formatGroup = (group: any[], key: string, defaultKeys: string[]) => {
                const result: any = { total: 0 };
                defaultKeys.forEach(k => result[k] = 0);
                group.forEach(item => {
                    result[item[key]] = item._count.id;
                    result.total += item._count.id;
                });
                return result;
            };

            const data = {
                trips: formatGroup(tripsGrouped, 'status', Object.values(TripStatus)),
                drivers: formatGroup(driversGrouped, 'status', Object.values(DriverStatus)),
                vehicles: formatGroup(vehiclesGrouped, 'status', Object.values(VehicleStatus)),
                finance: {
                    totalRevenue: revenueAgg._sum.price || 0
                },
                clients: {
                    activeTotal: activeClientsCount
                },
                upcomingTrips
            };

            return { 
                success: true, 
                message: "Dashboard summary retrieved successfully", 
                statusCode: 200, 
                data 
            };
        } catch (error) {
            console.error("Error generating dashboard summary:", error);
            return { 
                success: false, 
                message: "Failed to retrieve dashboard summary", 
                statusCode: 500, 
                error: String(error) 
            } as any;
        }
    }
}