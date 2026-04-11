import { param, query } from "express-validator";

export const idParamValidator = [
    param("id")
        .notEmpty()
        .withMessage("ID is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("ID must be a positive integer")
        .toInt()
];

export const paginationValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer")
        .toInt(),
    query("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive integer")
        .toInt(),
    query("search")
        .optional()
        .isString()
        .trim()
];