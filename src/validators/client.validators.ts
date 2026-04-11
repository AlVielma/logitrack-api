import { body } from "express-validator";

const rfcRegex = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;

export const createClientValidator = [
    body("businessName").notEmpty().withMessage("Business name is required").isString().isLength({ max: 100 }).withMessage("Business name must not exceed 100 characters"),
    body("rfc").notEmpty().withMessage("RFC is required").isString().toUpperCase().matches(rfcRegex).withMessage("Invalid RFC format"),
    body("zipCode").notEmpty().withMessage("Zip code is required").isString().isLength({ min: 5, max: 5 }).withMessage("Zip code must be 5 characters"),
    body("phone").optional().isString().isLength({ max: 20 }),
    body("address").optional().isString().isLength({ max: 255 }),
    body("email").optional().isEmail().withMessage("Invalid email format").isLength({ max: 255 }).normalizeEmail(),
    body("photoUrl").optional().isString().isURL().withMessage("Must be a valid URL")
];

export const updateClientValidator = [
    body("businessName").optional().isString().isLength({ max: 100 }).withMessage("Business name must not exceed 100 characters"),
    body("rfc").optional().isString().toUpperCase().matches(rfcRegex).withMessage("Invalid RFC format"),
    body("zipCode").optional().isString().isLength({ min: 5, max: 5 }).withMessage("Zip code must be 5 characters"),
    body("phone").optional().isString().isLength({ max: 20 }),
    body("address").optional().isString().isLength({ max: 255 }),
    body("email").optional().isEmail().withMessage("Invalid email format").isLength({ max: 255 }).normalizeEmail(),
    body("photoUrl").optional().isString().isURL().withMessage("Must be a valid URL"),
    body("isActive").optional().isBoolean().withMessage("isActive must be a boolean")
];