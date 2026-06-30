import type { Request, Response } from "express";

import type { AuthRequest } from "@/middlewares/authenticate";
import { asyncHandler } from "@/middlewares/asyncHandler";
import classService from "@/services/ClassService";

class ClassController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const classes = await classService.getAll();
    return res.json(classes);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const classData = await classService.getById(id);
    return res.json(classData);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, subject } = req.body;

    const newClass = await classService.create({
      name,
      subject,
      author: {
        connect: {
          id: req.userId!,
        },
      },
    });

    return res.status(201).json(newClass);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name, subject } = req.body;
    const updatedClass = await classService.update(id, { name, subject });
    return res.json(updatedClass);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await classService.delete(id);
    return res.status(204).send();
  });

  getByTeacherId = asyncHandler(async (req: Request, res: Response) => {
    const authorId = req.params.authorId as string;
    const classes = await classService.getByTeacherId(authorId);
    return res.json(classes);
  });
}

export default new ClassController();
