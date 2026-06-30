import { Router } from "express";

import UserController from "@/controllers/UserController";
import { validate } from "@/middlewares/validate";
import {
  createUserSchema,
  loginSchema,
  updateUserSchema,
} from "@/schemas/user.schema";

const router = Router();

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags:
 *       - Users
 */
router.post("/login", validate(loginSchema), UserController.login);

router.post("/", validate(createUserSchema), UserController.create);

router.get("/", UserController.getAll);

/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Retorna um usuário pelo email
 */
router.get("/email/:email", UserController.getByEmail);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 */
router.get("/:id", UserController.getById);

router.put("/:id", validate(updateUserSchema), UserController.update);

router.delete("/:id", UserController.delete);

export default router;
