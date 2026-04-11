import { Request, Response as ExResponse } from "express";
import { sendSuccess, sendError } from "../utils/response";
import { UserService } from "../services/user";

export class UserController {
    static async create(req: Request, res: ExResponse): Promise<void> {
        try {
            const data = req.body;
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
            const data = req.body;
            const result = await UserService.update(id, data);
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