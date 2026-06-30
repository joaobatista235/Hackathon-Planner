"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAlertSchema = exports.createAlertSchema = void 0;
const zod_1 = require("zod");
exports.createAlertSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Título obrigatório"),
    message: zod_1.z.string().min(1, "Mensagem obrigatória"),
    priority: zod_1.z.enum(["URGENT", "NEAR", "OVERDUE"]),
    dueDate: zod_1.z.string().datetime().optional(),
});
exports.updateAlertSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    message: zod_1.z.string().min(1).optional(),
    priority: zod_1.z.enum(["URGENT", "NEAR", "OVERDUE"]).optional(),
    dueDate: zod_1.z.string().datetime().optional(),
});
