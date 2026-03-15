import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, "Validation failed", errors.array());
    }
    next();
};
