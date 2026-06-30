"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssessmentSchema = exports.createAssessmentSchema = void 0;
const zod_1 = require("zod");
exports.createAssessmentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Título obrigatório"),
    description: zod_1.z.string().optional(),
    type: zod_1.z.enum(["PROVA", "TRABALHO"]),
    dueDate: zod_1.z.string().datetime({ message: "Data inválida" }),
    classId: zod_1.z.string().uuid("ID da turma inválido"),
});
exports.updateAssessmentSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    type: zod_1.z.enum(["PROVA", "TRABALHO"]).optional(),
    dueDate: zod_1.z.string().datetime().optional(),
    status: zod_1.z.enum(["PENDING", "DONE"]).optional(),
});
