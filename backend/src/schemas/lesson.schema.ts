import { z } from "zod";

export const createLessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  classId: z.string().uuid(),
  date: z.coerce.date().optional(),
});

export const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  date: z.coerce.date().optional(),
});
