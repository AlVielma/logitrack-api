import { body } from "express-validator";

export const createVehicleValidator = [
    body("plate")
        .notEmpty().withMessage("Plate is required").bail()
        .isString().bail()
        .toUpperCase()
        .isLength({ max: 20 }).withMessage("Plate must not exceed 20 characters"),
    body("brand").optional().isString().bail().isLength({ max: 50 }),
    body("model").optional().isString().bail().isLength({ max: 50 }),
    body("capacity").optional().isFloat({ min: 0 }).withMessage("Capacity must be a positive number"),
    body("vehicleConfiguration").optional().isString().bail().isLength({ max: 50 }),
    body("sctPermit").optional().isString().bail().isLength({ max: 50 }),
    body("insuranceCompany").optional().isString().bail().isLength({ max: 100 }),
    body("insurancePolicy").optional().isString().bail().isLength({ max: 100 }),
    body("isActive").optional().isBoolean().toBoolean().withMessage("isActive must be a boolean")
];

export const updateVehicleValidator = [
    body("plate").optional().isString().bail().toUpperCase().isLength({ max: 20 }),
    body("brand").optional().isString().bail().isLength({ max: 50 }),
    body("model").optional().isString().bail().isLength({ max: 50 }),
    body("capacity").optional().isFloat({ min: 0 }).withMessage("Capacity must be a positive number"),
    body("vehicleConfiguration").optional().isString().bail().isLength({ max: 50 }),
    body("sctPermit").optional().isString().bail().isLength({ max: 50 }),
    body("insuranceCompany").optional().isString().bail().isLength({ max: 100 }),
    body("insurancePolicy").optional().isString().bail().isLength({ max: 100 }),
    body("status").optional().isString().isIn(["AVAILABLE", "ON_TRIP", "MAINTENANCE"]).withMessage("Invalid status"),
    body("isActive").optional().isBoolean().toBoolean()
];