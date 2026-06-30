import { Router } from "express";

import ClassController from "@/controllers/ClassController";
import { authenticate } from "@/middlewares/authenticate";
import { validate } from "@/middlewares/validate";
import { createClassSchema, updateClassSchema } from "@/schemas/class.schema";

const router = Router();

router.get("/", ClassController.getAll);

/**
 * @swagger
 * /classes/author/{authorId}:
 *   get:
 *     summary: Retorna as turmas de um professor
 */
router.get("/author/:authorId", ClassController.getByTeacherId);

router.get("/:id", ClassController.getById);

router.post(
  "/",
  authenticate,
  validate(createClassSchema),
  ClassController.create,
);

router.put("/:id", validate(updateClassSchema), ClassController.update);

router.delete("/:id", ClassController.delete);

export default router;
