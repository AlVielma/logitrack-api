import { body } from "express-validator";

export const createUserValidator = [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email").isLength({ max: 255 }).normalizeEmail(),
    body("firstName").notEmpty().withMessage("First name is required").isString().isLength({ max: 50 }).withMessage("First name must not exceed 50 characters"),
    body("lastName").notEmpty().withMessage("Last name is required").isString().isLength({ max: 70 }).withMessage("Last name must not exceed 70 characters"),
    body("roleId").notEmpty().withMessage("Role ID is required").isInt(),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("phone").optional().isString().isLength({ max: 20 }).withMessage("Phone must not exceed 20 characters"),
    body("photoUrl").optional().isString().isURL().withMessage("Must be a valid URL")
];

export const updateUserValidator = [
    body("email").optional().isEmail().withMessage("Invalid email").isLength({ max: 255 }).normalizeEmail(),
    body("firstName").optional().isString().isLength({ max: 50 }).withMessage("First name must not exceed 50 characters"),
    body("lastName").optional().isString().isLength({ max: 70 }).withMessage("Last name must not exceed 70 characters"),
    body("roleId").optional().isInt(),
    body("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("phone").optional().isString().isLength({ max: 20 }).withMessage("Phone must not exceed 20 characters"),
    body("photoUrl").optional().isString().isURL().withMessage("Must be a valid URL"),
    body("isActive").optional().isBoolean().withMessage("isActive must be a boolean")
];