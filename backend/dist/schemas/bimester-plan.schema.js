"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBimesterPlanSchema = exports.createBimesterPlanSchema = void 0;
const zod_1 = require("zod");
exports.createBimesterPlanSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Título obrigatório"),
    goals: zod_1.z.string().min(1, "Objetivos obrigatórios"),
    startsAt: zod_1.z.string().datetime({ message: "Data de início inválida" }),
    endsAt: zod_1.z.string().datetime({ message: "Data de término inválida" }),
    classId: zod_1.z.string().uuid("ID da turma inválido"),
});
exports.updateBimesterPlanSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    goals: zod_1.z.string().min(1).optional(),
    startsAt: zod_1.z.string().datetime().optional(),
    endsAt: zod_1.z.string().datetime().optional(),
    status: zod_1.z.enum(["DRAFT", "DONE"]).optional(),
});
