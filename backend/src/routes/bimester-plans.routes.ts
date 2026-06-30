import { Router } from "express";

import BimesterPlanController from "@/controllers/BimesterPlanController";
import { authenticate } from "@/middlewares/authenticate";
import { validate } from "@/middlewares/validate";
import {
  createBimesterPlanSchema,
  updateBimesterPlanSchema,
} from "@/schemas/bimester-plan.schema";

const router = Router();

router.use(authenticate);

router.get("/", BimesterPlanController.getAll);
router.get("/class/:classId", BimesterPlanController.getByClassId);
router.get("/:id", BimesterPlanController.getById);
router.post(
  "/",
  validate(createBimesterPlanSchema),
  BimesterPlanController.create,
);
router.put(
  "/:id",
  validate(updateBimesterPlanSchema),
  BimesterPlanController.update,
);
router.patch("/:id/complete", BimesterPlanController.complete);
router.delete("/:id", BimesterPlanController.delete);

export default router;
