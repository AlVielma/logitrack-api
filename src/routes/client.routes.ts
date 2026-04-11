import { Router } from "express";
import { ClientController } from "../controllers/client.controller";
import { validate } from "../middlewares/validator";
import { createClientValidator, updateClientValidator } from "../validators/client.validators";
import { idParamValidator, paginationValidator } from "../validators/common.validators";

const router = Router();

router.post("/", createClientValidator, validate, ClientController.create);
router.get("/", paginationValidator, validate, ClientController.getAll);
router.get("/:id", idParamValidator, validate, ClientController.getById);
router.put("/:id", idParamValidator, updateClientValidator, validate, ClientController.update);
router.patch("/:id/toggle-active", idParamValidator, validate, ClientController.toggleActive);

export default router;