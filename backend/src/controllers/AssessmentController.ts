import type { Request, Response } from "express";

import type { AuthRequest } from "@/middlewares/authenticate";
import { asyncHandler } from "@/middlewares/asyncHandler";
import assessmentService from "@/services/AssessmentService";

class AssessmentController {
  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const assessments = await assessmentService.getAll(req.userId!);
    return res.json(assessments);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const assessment = await assessmentService.getById(req.params.id as string);
    return res.json(assessment);
  });

  getByClassId = asyncHandler(async (req: Request, res: Response) => {
    const assessments = await assessmentService.getByClassId(
      req.params.classId as string,
    );
    return res.json(assessments);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, description, type, dueDate, classId } = req.body;
    const assessment = await assessmentService.create({
      title,
      description,
      type,
      dueDate: new Date(dueDate),
      classId,
      authorId: req.userId!,
    });
    return res.status(201).json(assessment);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, type, dueDate, status } = req.body;
    const assessment = await assessmentService.update(
      req.params.id as string,
      {
        title,
        description,
        type,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status,
      },
    );
    return res.json(assessment);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await assessmentService.delete(req.params.id as string);
    return res.status(204).send();
  });
}

export default new AssessmentController();
