import type { Request, Response } from "express";

import type { AuthRequest } from "@/middlewares/authenticate";
import { asyncHandler } from "@/middlewares/asyncHandler";
import postsService from "@/services/PostsService";

class PostsController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const posts = await postsService.getAll();
    return res.json(posts);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const post = await postsService.getById(id);
    return res.json(post);
  });

  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, content } = req.body;
    const newPost = await postsService.create({
      title,
      content,
      authorId: req.userId,
    });
    return res.status(201).json(newPost);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, content, authorId } = req.body;
    const updated = await postsService.update(id, { title, content, authorId });
    return res.json(updated);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const deleted = await postsService.delete(id);
    return res.json(deleted);
  });

  search = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    const posts = await postsService.search(String(q));
    return res.json(posts);
  });

  getMyPosts = asyncHandler(async (req: Request, res: Response) => {
    const authorId = req.params.authorId as string;
    const posts = await postsService.getByAuthorId(authorId);
    return res.json(posts);
  });
}

export default new PostsController();
