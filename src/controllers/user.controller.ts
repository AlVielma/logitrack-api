import { Request, Response as ExResponse } from "express";
import { sendSuccess, sendError } from "../utils/response";
import { UserService } from "../services/user";
import { uploadToCloudinary } from "../utils/cloudinary";

export class UserController {
    static async create(req: Request, res: ExResponse): Promise<void> {
        try {
            const data = req.body || {};
            
            // Extraer el archivo de la memoria si enviaron una foto
            const files = req.files as Express.Multer.File[];
            const photoFile = files?.find(f => f.fieldname === 'photo');
            
            if (photoFile) {
                const cloudinaryUrl = await uploadToCloudinary(photoFile.buffer, "users");
                data.photoUrl = cloudinaryUrl;
            }

            const result = await UserService.create(data);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            console.error("Error in UserController.create:", error);
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async getAll(req: Request, res: ExResponse): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";
            
            const result = await UserService.getAll(page, limit, search);
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
            const result = await UserService.getById(id);
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
            
            // Buscar si adjuntaron una nueva foto
            const files = req.files as Express.Multer.File[];
            const photoFile = files?.find(f => f.fieldname === 'photo');
            
            if (photoFile) {
                const cloudinaryUrl = await uploadToCloudinary(photoFile.buffer, "users");
                data.photoUrl = cloudinaryUrl;
            }

            const result = await UserService.update(id, data);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            console.error("Error in UserController.update:", error);
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async toggleActive(req: Request, res: ExResponse): Promise<void> {
        try {
            const id = Number(req.params.id);
            const result = await UserService.toggleActive(id);
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