"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/database/prisma"));
class BimesterPlanRepository {
    async getAll(authorId) {
        return prisma_1.default.bimesterPlan.findMany({
            where: { authorId },
            include: { class: { select: { id: true, name: true, subject: true } } },
            orderBy: { startsAt: "asc" },
        });
    }
    async getById(id) {
        return prisma_1.default.bimesterPlan.findUnique({
            where: { id },
            include: { class: { select: { id: true, name: true, subject: true } } },
        });
    }
    async getByClassId(classId) {
        return prisma_1.default.bimesterPlan.findMany({
            where: { classId },
            include: { class: { select: { id: true, name: true, subject: true } } },
            orderBy: { startsAt: "asc" },
        });
    }
    async create(data) {
        return prisma_1.default.bimesterPlan.create({
            data,
            include: { class: { select: { id: true, name: true, subject: true } } },
        });
    }
    async update(id, data) {
        return prisma_1.default.bimesterPlan.update({
            where: { id },
            data,
            include: { class: { select: { id: true, name: true, subject: true } } },
        });
    }
    async complete(id) {
        return prisma_1.default.bimesterPlan.update({
            where: { id },
            data: { status: "DONE" },
            include: { class: { select: { id: true, name: true, subject: true } } },
        });
    }
    async delete(id) {
        return prisma_1.default.bimesterPlan.delete({ where: { id } });
    }
}
exports.default = new BimesterPlanRepository();
