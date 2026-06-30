import { z } from "zod";

export const createBimesterPlanSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  goals: z.string().min(1, "Objetivos obrigatórios"),
  startsAt: z.string().datetime({ message: "Data de início inválida" }),
  endsAt: z.string().datetime({ message: "Data de término inválida" }),
  classId: z.string().uuid("ID da turma inválido"),
});

export const updateBimesterPlanSchema = z.object({
  title: z.string().min(1).optional(),
  goals: z.string().min(1).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  status: z.enum(["DRAFT", "DONE"]).optional(),
});
