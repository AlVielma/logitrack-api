import { Request, Response as ExResponse } from "express";
import { sendSuccess, sendError } from "../utils/response";
import { VehicleService } from "../services/vehicle";
import { uploadToCloudinary } from "../utils/cloudinary";

export class VehicleController {
    static async create(req: Request, res: ExResponse): Promise<void> {
        try {
            const data = req.body || {};
            
            const files = req.files as Express.Multer.File[] || [];
            const photoFiles = files.filter(f => f.fieldname === 'photos');
            
            if (photoFiles.length > 5) {
                sendError(res, 400, "Maximum of 5 photos allowed per vehicle");
                return;
            }

            const uploadPromises = photoFiles.map(file => uploadToCloudinary(file.buffer, "vehicles"));
            const photoUrls = await Promise.all(uploadPromises);

            data.photoUrls = photoUrls;

            const result = await VehicleService.create(data);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            console.error("Error in VehicleController.create:", error);
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async getAll(req: Request, res: ExResponse): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            const result = await VehicleService.getAll(page, limit, search);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async getById(req: Request, res: ExResponse): Promise<void> {
        try {
            const id = Number(req.params.id);
            const result = await VehicleService.getById(id);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async update(req: Request, res: ExResponse): Promise<void> {
        try {
            const id = Number(req.params.id);
            const data = req.body || {};

            const files = req.files as Express.Multer.File[] || [];
            const photoFiles = files.filter(f => f.fieldname === 'photos');

            if (photoFiles.length > 5) {
                sendError(res, 400, "Maximum of 5 photos allowed per request");
                return;
            }

            const uploadPromises = photoFiles.map(file => uploadToCloudinary(file.buffer, "vehicles"));
            const photoUrls = await Promise.all(uploadPromises);

            data.photoUrls = photoUrls;

            const result = await VehicleService.update(id, data);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            console.error("Error in VehicleController.update:", error);
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async toggleActive(req: Request, res: ExResponse): Promise<void> {
        try {
            const id = Number(req.params.id);
            const result = await VehicleService.toggleActive(id);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            sendError(res, 500, "Internal server error", error);
        }
    }
}