import { Router } from "express";

import LessonController from "@/controllers/LessonController";
import { authenticate } from "@/middlewares/authenticate";
import { validate } from "@/middlewares/validate";
import {
  createLessonSchema,
  updateLessonSchema,
} from "@/schemas/lesson.schema";

const router = Router();

router.get("/", LessonController.getAll);

/**
 * @swagger
 * /lessons/class/{classId}:
 *   get:
 *     summary: Retorna as aulas de uma turma
 */
router.get("/class/:classId", LessonController.getByClassId);

router.get("/:id", LessonController.getById);

router.post(
  "/",
  authenticate,
  validate(createLessonSchema),
  LessonController.create,
);

router.put("/:id", validate(updateLessonSchema), LessonController.update);

router.delete("/:id", LessonController.delete);

export default router;
