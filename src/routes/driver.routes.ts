import { Router } from "express";
import { DriverController } from "../controllers/driver.controller";
import { validate } from "../middlewares/validator";
import { createDriverValidator, updateDriverValidator } from "../validators/driver.validators";
import { idParamValidator, paginationValidator } from "../validators/common.validators";

const router = Router();

router.post("/", createDriverValidator, validate, DriverController.create);
router.get("/", paginationValidator, validate, DriverController.getAll);
router.get("/:id", idParamValidator, validate, DriverController.getById);
router.put("/:id", idParamValidator, updateDriverValidator, validate, DriverController.update);
router.patch("/:id/toggle-active", idParamValidator, validate, DriverController.toggleActive);

export default router;