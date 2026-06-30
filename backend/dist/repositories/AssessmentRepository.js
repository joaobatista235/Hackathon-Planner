"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/database/prisma"));
class AssessmentRepository {
    async getAll(authorId) {
        return prisma_1.default.assessment.findMany({
            where: { authorId },
            include: { class: { select: { id: true, name: true, subject: true } } },
            orderBy: { dueDate: "asc" },
        });
    }
    async getById(id) {
        return prisma_1.default.assessment.findUnique({
            where: { id },
            include: { class: { select: { id: true, name: true, subject: true } } },
        });
    }
    async getByClassId(classId) {
        return prisma_1.default.assessment.findMany({
            where: { classId },
            include: { class: { select: { id: true, name: true, subject: true } } },
            orderBy: { dueDate: "asc" },
        });
    }
    async create(data) {
        return prisma_1.default.assessment.create({
            data,
            include: { class: { select: { id: true, name: true, subject: true } } },
        });
    }
    async update(id, data) {
        return prisma_1.default.assessment.update({
            where: { id },
            data,
            include: { class: { select: { id: true, name: true, subject: true } } },
        });
    }
    async delete(id) {
        return prisma_1.default.assessment.delete({ where: { id } });
    }
}
exports.default = new AssessmentRepository();
