import { body } from "express-validator";

const rfcRegex = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
const curpRegex = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;

export const createDriverValidator = [
    body("firstName").notEmpty().withMessage("First name is required").bail().isString().bail().isLength({ max: 50 }).withMessage("First name must not exceed 50 characters"),
    body("lastName").notEmpty().withMessage("Last name is required").bail().isString().bail().isLength({ max: 70 }).withMessage("Last name must not exceed 70 characters"),
    body("rfc").notEmpty().withMessage("RFC is required").bail().isString().bail().toUpperCase().matches(rfcRegex).withMessage("Invalid RFC format"),
    body("curp").notEmpty().withMessage("CURP is required").bail().isString().bail().toUpperCase().matches(curpRegex).withMessage("Invalid CURP format"),
    body("nss").optional().isString().bail().isLength({ min: 11, max: 11 }).withMessage("NSS must be exactly 11 digits"),
    body("sctLicense").notEmpty().withMessage("SCT License is required").bail().isString().bail().isLength({ max: 50 }).withMessage("License must not exceed 50 characters"),
    body("licenseType").notEmpty().withMessage("License Type is required").bail().isString().bail().isLength({ max: 50 }).withMessage("License type must not exceed 50 characters"),
    body("phone").optional().isString().bail().isLength({ max: 20 }),
    body("photoUrl").optional().isString().bail().isURL().withMessage("Must be a valid URL")
];

export const updateDriverValidator = [
    body("firstName").optional().isString().bail().isLength({ max: 50 }).withMessage("First name must not exceed 50 characters"),
    body("lastName").optional().isString().bail().isLength({ max: 70 }).withMessage("Last name must not exceed 70 characters"),
    body("rfc").optional().isString().bail().toUpperCase().matches(rfcRegex).withMessage("Invalid RFC format"),
    body("curp").optional().isString().bail().toUpperCase().matches(curpRegex).withMessage("Invalid CURP format"),
    body("nss").optional().isString().bail().isLength({ min: 11, max: 11 }).withMessage("NSS must be exactly 11 digits"),
    body("sctLicense").optional().isString().bail().isLength({ max: 50 }),
    body("licenseType").optional().isString().bail().isLength({ max: 50 }),
    body("phone").optional().isString().bail().isLength({ max: 20 }),
    body("photoUrl").optional().isString().bail().isURL().withMessage("Must be a valid URL"),
    body("isActive").optional().isBoolean().toBoolean().withMessage("isActive must be a boolean")
];