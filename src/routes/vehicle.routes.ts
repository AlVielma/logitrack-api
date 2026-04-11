import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller";
import { validate } from "../middlewares/validator";
import { createVehicleValidator, updateVehicleValidator } from "../validators/vehicle.validators";
import { idParamValidator, paginationValidator } from "../validators/common.validators";

const router = Router();

router.post("/", createVehicleValidator, validate, VehicleController.create);
router.get("/", paginationValidator, validate, VehicleController.getAll);
router.get("/:id", idParamValidator, validate, VehicleController.getById);
router.put("/:id", idParamValidator, updateVehicleValidator, validate, VehicleController.update);
router.patch("/:id/toggle-active", idParamValidator, validate, VehicleController.toggleActive);

export default router;