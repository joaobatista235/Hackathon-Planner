import type { Request, Response } from "express";

import type { AuthRequest } from "@/middlewares/authenticate";
import { asyncHandler } from "@/middlewares/asyncHandler";
import lessonService from "@/services/LessonService";

class LessonController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const lessons = await lessonService.getAll();
    return res.json(lessons);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const lessonData = await lessonService.getById(id);
    return res.json(lessonData);
  });

  getByClassId = asyncHandler(async (req: Request, res: Response) => {
    const classId = req.params.classId as string;
    const lessons = await lessonService.getByLessonId(classId);
    return res.json(lessons);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, description, classId, date } = req.body;

    const newLesson = await lessonService.create({
      title,
      description,
      date: date ? new Date(date) : new Date(),
      class: {
        connect: {
          id: classId,
        },
      },
      author: {
        connect: {
          id: req.userId!,
        },
      },
    });

    return res.status(201).json(newLesson);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { title, description, date } = req.body;
    const updatedLesson = await lessonService.update(id, {
      title,
      description,
      date: date ? new Date(date) : undefined,
    });
    return res.json(updatedLesson);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await lessonService.delete(id);
    return res.status(204).send();
  });
}

export default new LessonController();
