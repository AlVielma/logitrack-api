import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { loginValidator, verifyOtpValidator } from "../validators/auth.validators";
import { validate } from "../middlewares/validator";
import { authenticate } from "../middlewares/auth";
const router = Router();

router.post("/login", loginValidator, validate, AuthController.login);
router.post("/verify-otp", verifyOtpValidator, validate, AuthController.verifyOtp);
router.get("/me", authenticate, AuthController.me);

export default router;