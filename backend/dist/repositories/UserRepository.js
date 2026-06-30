"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/database/prisma"));
const userSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
};
class UserRepository {
    async getAll() {
        return prisma_1.default.user.findMany({
            orderBy: { createdAt: "asc" },
            select: userSelect,
        });
    }
    async getById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
            select: userSelect,
        });
    }
    async getByEmail(email) {
        return prisma_1.default.user.findUnique({
            where: { email },
            select: userSelect,
        });
    }
    async getByEmailWithPassword(email) {
        return prisma_1.default.user.findUnique({
            where: { email },
        });
    }
    async create(data) {
        return prisma_1.default.user.create({
            data,
            select: userSelect,
        });
    }
    async update(id, data) {
        return prisma_1.default.user.update({
            where: { id },
            data,
            select: userSelect,
        });
    }
    async delete(id) {
        return prisma_1.default.user.delete({
            where: { id },
            select: userSelect,
        });
    }
}
exports.default = new UserRepository();
