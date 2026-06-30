"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/database/prisma"));
class LessonRepository {
    async getAll() {
        return prisma_1.default.lesson.findMany({
            orderBy: { id: "asc" },
        });
    }
    async getById(id) {
        return prisma_1.default.lesson.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return prisma_1.default.lesson.create({
            data,
        });
    }
    async update(id, data) {
        return prisma_1.default.lesson.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.default.lesson.delete({
            where: { id },
        });
    }
    async getByLessonId(classId) {
        return prisma_1.default.lesson.findMany({
            where: { classId },
            orderBy: { id: "asc" },
        });
    }
}
exports.default = new LessonRepository();
