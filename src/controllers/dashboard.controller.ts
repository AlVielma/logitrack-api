import { Request, Response as ExResponse } from "express";
import { sendSuccess, sendError } from "../utils/response";
import { DashboardService } from "../services/dashboard";

export class DashboardController {
    static async getSummary(req: Request, res: ExResponse): Promise<void> {
        try {
            const result = await DashboardService.getSummary();
            if (!result.success) {
                sendError(res, result.statusCode, result.message, (result as any).error);
                return;
            }
            sendSuccess(res, result.statusCode, result.message, result.data);
        } catch (error) {
            console.error("Error in DashboardController.getSummary:", error);
            sendError(res, 500, "Internal server error", error);
        }
    }
}