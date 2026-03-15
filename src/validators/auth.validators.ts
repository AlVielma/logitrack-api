import { body } from "express-validator";

export const loginValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .bail()
        .isString()
        .withMessage("Password must be a string")
        .bail()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{8,}$/)
        .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
];

export const verifyOtpValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email format")
        .bail()
        .normalizeEmail(),
    body("code")
        .notEmpty()
        .withMessage("Code is required")
        .bail()
        .isLength({ min: 6, max: 6 })
        .withMessage("Code must be 6 digits")
        .bail()
        .isString()
        .withMessage("Code must be a string"),
];