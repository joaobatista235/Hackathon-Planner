"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/database/prisma"));
class ClassRepository {
    async getAll() {
        return prisma_1.default.class.findMany({
            orderBy: { id: "asc" },
        });
    }
    async getById(id) {
        return prisma_1.default.class.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return prisma_1.default.class.create({
            data,
        });
    }
    async update(id, data) {
        return prisma_1.default.class.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.default.class.delete({
            where: { id },
        });
    }
    async getByTeacherId(authorId) {
        return prisma_1.default.class.findMany({
            where: { authorId },
            orderBy: { id: "asc" },
        });
    }
}
exports.default = new ClassRepository();
