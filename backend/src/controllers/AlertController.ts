import type { Request, Response } from "express";

import type { AuthRequest } from "@/middlewares/authenticate";
import { asyncHandler } from "@/middlewares/asyncHandler";
import alertService from "@/services/AlertService";

class AlertController {
  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const alerts = await alertService.getAll(req.userId!);
    return res.json(alerts);
  });

  getPending = asyncHandler(async (req: AuthRequest, res: Response) => {
    const alerts = await alertService.getPending(req.userId!);
    return res.json(alerts);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, message, priority, dueDate } = req.body;
    const alert = await alertService.create({
      title,
      message,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      authorId: req.userId!,
    });
    return res.status(201).json(alert);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { title, message, priority, dueDate } = req.body;
    const alert = await alertService.update(req.params.id as string, {
      title,
      message,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    return res.json(alert);
  });

  complete = asyncHandler(async (req: Request, res: Response) => {
    const alert = await alertService.complete(req.params.id as string);
    return res.json(alert);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await alertService.delete(req.params.id as string);
    return res.status(204).send();
  });
}

export default new AlertController();
