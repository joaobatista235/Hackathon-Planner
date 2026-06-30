import { z } from "zod";

export const createAssessmentSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
  type: z.enum(["PROVA", "TRABALHO"]),
  dueDate: z.string().datetime({ message: "Data inválida" }),
  classId: z.string().uuid("ID da turma inválido"),
});

export const updateAssessmentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.enum(["PROVA", "TRABALHO"]).optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(["PENDING", "DONE"]).optional(),
});
