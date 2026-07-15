import type { Request, Response } from "express";
import { asyncHandler } from "@/middlewares/asyncHandler";
import attachmentService from "@/services/AttachmentService";
import { AppError } from "@/middlewares/errorHandler";

class AttachmentController {
  getByLesson = asyncHandler(async (req: Request, res: Response) => {
    const attachments = await attachmentService.getByLesson(req.params.lessonId as string);
    return res.json(attachments);
  });

  upload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw new AppError("Nenhum arquivo enviado", 400);

    const attachment = await attachmentService.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      lessonId: req.params.lessonId as string,
    });

    return res.status(201).json(attachment);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await attachmentService.delete(req.params.id as string);
    return res.status(204).send();
  });
}

export default new AttachmentController();
