"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLessonSchema = exports.createLessonSchema = void 0;
const zod_1 = require("zod");
exports.createLessonSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    classId: zod_1.z.string().uuid(),
    date: zod_1.z.coerce.date().optional(),
});
exports.updateLessonSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().min(1).optional(),
    date: zod_1.z.coerce.date().optional(),
});
