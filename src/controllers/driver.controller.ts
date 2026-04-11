import { Request, Response as ExResponse } from "express";
import { sendSuccess, sendError } from "../utils/response";
import { DriverService } from "../services/driver";
import { uploadToCloudinary } from "../utils/cloudinary";

export class DriverController {
    static async create(req: Request, res: ExResponse): Promise<void> {
        try {
            const data = req.body || {};

            const files = req.files as Express.Multer.File[];
            const photoFile = files?.find(f => f.fieldname === 'photo');
            
            if (photoFile) {
                const cloudinaryUrl = await uploadToCloudinary(photoFile.buffer, "drivers");
                data.photoUrl = cloudinaryUrl;
            }

            const result = await DriverService.create(data);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async getAll(req: Request, res: ExResponse): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            const result = await DriverService.getAll(page, limit, search);
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
            const result = await DriverService.getById(id);
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

            const files = req.files as Express.Multer.File[];
            const photoFile = files?.find(f => f.fieldname === 'photo');
            
            if (photoFile) {
                const cloudinaryUrl = await uploadToCloudinary(photoFile.buffer, "drivers");
                data.photoUrl = cloudinaryUrl;
            }

            const result = await DriverService.update(id, data);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async toggleActive(req: Request, res: ExResponse): Promise<void> {
        try {
            const id = Number(req.params.id);
            const result = await DriverService.toggleActive(id);
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