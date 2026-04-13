import { Request, Response as ExResponse } from "express";
import { sendSuccess, sendError } from "../utils/response";
import { TripService } from "../services/trip";

export class TripController {
    static async create(req: Request, res: ExResponse): Promise<void> {
        try {
            const data = req.body || {};
            const result = await TripService.create(data);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            console.error("Error in TripController.create:", error);
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async getAll(req: Request, res: ExResponse): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            const result = await TripService.getAll(page, limit, search);
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
            const result = await TripService.getById(id);
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

            const result = await TripService.update(id, data);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            console.error("Error in TripController.update:", error);
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async updateStatus(req: Request, res: ExResponse): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { status } = req.body;
            
            const result = await TripService.updateStatus(id, status);
            if (!result.success) {
                sendError(res, result.statusCode, result.message);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            console.error("Error in TripController.updateStatus:", error);
            sendError(res, 500, "Internal server error", error);
        }
    }
}