import { body } from "express-validator";

export const createTripValidator = [
    body("origin").notEmpty().withMessage("Origin is required").bail().isString().bail().isLength({ max: 255 }),
    body("originZipCode").notEmpty().withMessage("Origin zip code is required").bail().isString().bail().isLength({ min: 5, max: 5 }),
    body("destination").notEmpty().withMessage("Destination is required").bail().isString().bail().isLength({ max: 255 }),
    body("destZipCode").notEmpty().withMessage("Destination zip code is required").bail().isString().bail().isLength({ min: 5, max: 5 }),
    
    body("clientId").notEmpty().withMessage("Client ID is required").bail().isInt().toInt(),
    body("driverId").notEmpty().withMessage("Driver ID is required").bail().isInt().toInt(),
    body("vehicleId").notEmpty().withMessage("Vehicle ID is required").bail().isInt().toInt(),
    body("operatorId").optional().isInt().toInt(),
    
    body("scheduledDate").optional().isISO8601().toDate().withMessage("Must be a valid ISO8601 date"),
    body("price").optional().isFloat({ min: 0 }).toFloat().withMessage("Price must be a positive number"),
    body("cartaPorteUuid").optional().isString().bail().isLength({ max: 100 })
];

export const updateTripValidator = [
    body("origin").optional().isString().bail().isLength({ max: 255 }),
    body("originZipCode").optional().isString().bail().isLength({ min: 5, max: 5 }),
    body("destination").optional().isString().bail().isLength({ max: 255 }),
    body("destZipCode").optional().isString().bail().isLength({ min: 5, max: 5 }),
    
    body("clientId").optional().isInt().toInt(),
    body("driverId").optional().isInt().toInt(),
    body("vehicleId").optional().isInt().toInt(),
    body("operatorId").optional().isInt().toInt(),
    
    body("scheduledDate").optional().isISO8601().toDate(),
    body("price").optional().isFloat({ min: 0 }).toFloat(),
    body("cartaPorteUuid").optional().isString().bail().isLength({ max: 100 })
];

export const updateTripStatusValidator = [
    body("status")
        .notEmpty().withMessage("Status is required").bail()
        .isString().bail()
        .isIn(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
        .withMessage("Invalid status. Allowed values: PENDING, IN_PROGRESS, COMPLETED, CANCELLED")
];