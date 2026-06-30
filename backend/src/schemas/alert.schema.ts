import { z } from "zod";

export const createAlertSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  message: z.string().min(1, "Mensagem obrigatória"),
  priority: z.enum(["URGENT", "NEAR", "OVERDUE"]),
  dueDate: z.string().datetime().optional(),
});

export const updateAlertSchema = z.object({
  title: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
  priority: z.enum(["URGENT", "NEAR", "OVERDUE"]).optional(),
  dueDate: z.string().datetime().optional(),
});
