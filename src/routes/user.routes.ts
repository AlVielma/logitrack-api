import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validator";
import { createUserValidator, updateUserValidator } from "../validators/user.validators";

const router = Router();

router.post("/", createUserValidator, validate, UserController.create);
router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.put("/:id", updateUserValidator, validate, UserController.update);
router.patch("/:id/toggle-active", UserController.toggleActive);

export default router;