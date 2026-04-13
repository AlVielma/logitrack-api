import { Router } from "express";
import { TripController } from "../controllers/trip.controller";
import { validate } from "../middlewares/validator";
import { createTripValidator, updateTripValidator, updateTripStatusValidator } from "../validators/trip.validators";
import { idParamValidator, paginationValidator } from "../validators/common.validators";

const router = Router();

router.post("/", createTripValidator, validate, TripController.create);
router.get("/", paginationValidator, validate, TripController.getAll);
router.get("/:id", idParamValidator, validate, TripController.getById);
router.put("/:id", idParamValidator, updateTripValidator, validate, TripController.update);
router.patch("/:id/status", idParamValidator, updateTripStatusValidator, validate, TripController.updateStatus);

export default router;