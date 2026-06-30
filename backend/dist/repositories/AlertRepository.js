"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/database/prisma"));
class AlertRepository {
    async getAll(authorId) {
        return prisma_1.default.alert.findMany({
            where: { authorId },
            orderBy: [{ status: "asc" }, { dueDate: "asc" }],
        });
    }
    async getPending(authorId) {
        return prisma_1.default.alert.findMany({
            where: { authorId, status: "PENDING" },
            orderBy: { dueDate: "asc" },
        });
    }
    async getById(id) {
        return prisma_1.default.alert.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma_1.default.alert.create({ data });
    }
    async update(id, data) {
        return prisma_1.default.alert.update({ where: { id }, data });
    }
    async complete(id) {
        return prisma_1.default.alert.update({
            where: { id },
            data: { status: "DONE" },
        });
    }
    async delete(id) {
        return prisma_1.default.alert.delete({ where: { id } });
    }
}
exports.default = new AlertRepository();
