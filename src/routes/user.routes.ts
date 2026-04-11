import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validator";
import { createUserValidator, updateUserValidator } from "../validators/user.validators";
import { idParamValidator, paginationValidator } from "../validators/common.validators";

const router = Router();

router.post("/", createUserValidator, validate, UserController.create);
router.get("/", paginationValidator, validate, UserController.getAll);
router.get("/:id", idParamValidator, validate, UserController.getById);
router.put("/:id", idParamValidator, updateUserValidator, validate, UserController.update);
router.patch("/:id/toggle-active", idParamValidator, validate, UserController.toggleActive);

export default router;