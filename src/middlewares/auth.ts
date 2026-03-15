import { Request, Response,NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { sendError } from "../utils/response";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader){
        const token = authHeader.split(" ")[1];
        if (!token) {
            return sendError(res, 401, "Token missing");
        }
        try{
            const decoded = verifyToken(token);
            (req as any).user = decoded;
            next();
        } catch (error) {
            return sendError(res, 401, "Invalid token", error);
        }
    } else {
        return sendError(res, 401, "Authorization header missing");
    }
}