import type { Request, Response } from "express";

import { asyncHandler } from "@/middlewares/asyncHandler";
import userService from "@/services/UserService";

class UserController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const users = await userService.getAll();
    return res.json(users);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = await userService.getById(id);
    return res.json(user);
  });

  getByEmail = asyncHandler(async (req: Request, res: Response) => {
    const email = req.params.email as string;
    const user = await userService.getByEmail(email);
    return res.json(user);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.create(req.body);
    return res.status(201).json(user);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updatedUser = await userService.update(id, req.body);
    return res.status(200).json(updatedUser);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await userService.delete(id);
    return res.json(deleted);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    return res.status(200).json(result);
  });
}

export default new UserController();
