import { Router } from "express";
import { ClientController } from "../controllers/client.controller";
import { validate } from "../middlewares/validator";
import { createClientValidator, updateClientValidator } from "../validators/client.validators";

const router = Router();

router.post("/", createClientValidator, validate, ClientController.create);
router.get("/", ClientController.getAll);
router.get("/:id", ClientController.getById);
router.put("/:id", updateClientValidator, validate, ClientController.update);
router.patch("/:id/toggle-active", ClientController.toggleActive);

export default router;