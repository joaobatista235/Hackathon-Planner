import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  authorId: z.string().uuid().optional(),
});

export const searchPostSchema = z.object({
  q: z.string().min(1),
});
