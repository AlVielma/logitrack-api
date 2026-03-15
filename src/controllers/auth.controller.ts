import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/response";
import { AuthService } from "../services/auth";
import { LoginRequest, VerifyOtpRequest} from "../interfaces/auth";

export class AuthController {
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const data: LoginRequest = req.body;
            const result = await AuthService.login(data);
            sendSuccess(res, 200, result.message);
        } catch (error) {
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const data: VerifyOtpRequest = req.body;
            const result = await AuthService.verifyOtp(data);
            sendSuccess(res, 200, "OTP verified successfully", result);
        } catch (error) {
            sendError(res, 500, "Internal server error", error);
        }
    }

    static async me(req: Request, res: Response): Promise<void> {
        try {
            const user = (req as any).user;
            sendSuccess(res, 200, "User info retrieved successfully", user);
        } catch (error) {
            sendError(res, 500, "Internal server error", error);
        }
    }

}