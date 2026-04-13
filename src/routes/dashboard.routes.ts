import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/summary", DashboardController.getSummary);

export default router;