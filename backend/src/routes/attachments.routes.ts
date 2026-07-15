import { Router } from "express";
import AttachmentController from "@/controllers/AttachmentController";
import { authenticate } from "@/middlewares/authenticate";
import { upload } from "@/middlewares/upload";

const router = Router();

// GET /lessons/:lessonId/attachments
router.get(
  "/lessons/:lessonId/attachments",
  authenticate,
  AttachmentController.getByLesson,
);

// POST /lessons/:lessonId/attachments
router.post(
  "/lessons/:lessonId/attachments",
  authenticate,
  upload.single("file"),
  AttachmentController.upload,
);

// DELETE /attachments/:id
router.delete("/attachments/:id", authenticate, AttachmentController.delete);

export default router;
