"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/database/prisma"));
class PostsRepository {
    async getAll() {
        return prisma_1.default.post.findMany({
            include: {
                author: true,
            },
            orderBy: { id: "asc" },
        });
    }
    async getById(id) {
        return prisma_1.default.post.findUnique({
            where: { id },
            include: {
                author: true,
            },
        });
    }
    async create(data) {
        return prisma_1.default.post.create({
            data,
            include: {
                author: true,
            },
        });
    }
    async update(id, data) {
        return prisma_1.default.post.update({
            where: { id },
            data,
            include: {
                author: true,
            },
        });
    }
    async delete(id) {
        return prisma_1.default.post.delete({
            where: { id },
        });
    }
    async search(term) {
        return prisma_1.default.post.findMany({
            where: {
                OR: [
                    { title: { contains: term, mode: "insensitive" } },
                    { content: { contains: term, mode: "insensitive" } },
                ],
            },
            include: {
                author: true,
            },
            orderBy: { id: "asc" },
        });
    }
    async getByAuthorId(authorId) {
        return prisma_1.default.post.findMany({
            where: { authorId },
            orderBy: { createdAt: "asc" },
            include: {
                author: true,
            },
        });
    }
}
exports.default = new PostsRepository();
