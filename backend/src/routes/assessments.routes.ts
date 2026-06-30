import { Router } from "express";

import AssessmentController from "@/controllers/AssessmentController";
import { authenticate } from "@/middlewares/authenticate";
import { validate } from "@/middlewares/validate";
import {
  createAssessmentSchema,
  updateAssessmentSchema,
} from "@/schemas/assessment.schema";

const router = Router();

router.use(authenticate);

router.get("/", AssessmentController.getAll);
router.get("/class/:classId", AssessmentController.getByClassId);
router.get("/:id", AssessmentController.getById);
router.post("/", validate(createAssessmentSchema), AssessmentController.create);
router.put(
  "/:id",
  validate(updateAssessmentSchema),
  AssessmentController.update,
);
router.delete("/:id", AssessmentController.delete);

export default router;
