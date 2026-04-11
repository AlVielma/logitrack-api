import { Router } from "express";
import { DriverController } from "../controllers/driver.controller";
import { validate } from "../middlewares/validator";
import { createDriverValidator, updateDriverValidator } from "../validators/driver.validators";

const router = Router();

router.post("/", createDriverValidator, validate, DriverController.create);
router.get("/", DriverController.getAll);
router.get("/:id", DriverController.getById);
router.put("/:id", updateDriverValidator, validate, DriverController.update);
router.patch("/:id/toggle-active", DriverController.toggleActive);

export default router;