import { Router } from "express";

import AlertController from "@/controllers/AlertController";
import { authenticate } from "@/middlewares/authenticate";
import { validate } from "@/middlewares/validate";
import { createAlertSchema, updateAlertSchema } from "@/schemas/alert.schema";

const router = Router();

router.use(authenticate);

router.get("/", AlertController.getAll);
router.get("/pending", AlertController.getPending);
router.post("/", validate(createAlertSchema), AlertController.create);
router.put("/:id", validate(updateAlertSchema), AlertController.update);
router.patch("/:id/complete", AlertController.complete);
router.delete("/:id", AlertController.delete);

export default router;
