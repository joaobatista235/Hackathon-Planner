import type { Request, Response } from "express";

import type { AuthRequest } from "@/middlewares/authenticate";
import { asyncHandler } from "@/middlewares/asyncHandler";
import bimesterPlanService from "@/services/BimesterPlanService";

class BimesterPlanController {
  getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const plans = await bimesterPlanService.getAll(req.userId!);
    return res.json(plans);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const plan = await bimesterPlanService.getById(req.params.id as string);
    return res.json(plan);
  });

  getByClassId = asyncHandler(async (req: Request, res: Response) => {
    const plans = await bimesterPlanService.getByClassId(
      req.params.classId as string,
    );
    return res.json(plans);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, goals, startsAt, endsAt, classId } = req.body;
    const plan = await bimesterPlanService.create({
      title,
      goals,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      classId,
      authorId: req.userId!,
    });
    return res.status(201).json(plan);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { title, goals, startsAt, endsAt, status } = req.body;
    const plan = await bimesterPlanService.update(req.params.id as string, {
      title,
      goals,
      startsAt: startsAt ? new Date(startsAt) : undefined,
      endsAt: endsAt ? new Date(endsAt) : undefined,
      status,
    });
    return res.json(plan);
  });

  complete = asyncHandler(async (req: Request, res: Response) => {
    const plan = await bimesterPlanService.complete(req.params.id as string);
    return res.json(plan);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await bimesterPlanService.delete(req.params.id as string);
    return res.status(204).send();
  });
}

export default new BimesterPlanController();
