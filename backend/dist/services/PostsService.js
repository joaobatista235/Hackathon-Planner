"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PostsRepository_1 = __importDefault(require("@/repositories/PostsRepository"));
class PostsService {
    async getAll() {
        return PostsRepository_1.default.getAll();
    }
    async getById(id) {
        return PostsRepository_1.default.getById(id);
    }
    async create(data) {
        const { title, content, authorId } = data;
        return PostsRepository_1.default.create({
            title,
            content,
            author: authorId ? { connect: { id: authorId } } : undefined,
        });
    }
    async update(id, data) {
        const { title, content, authorId } = data;
        return PostsRepository_1.default.update(id, {
            title,
            content,
            author: authorId ? { connect: { id: authorId } } : undefined,
        });
    }
    async delete(id) {
        return PostsRepository_1.default.delete(id);
    }
    async search(q) {
        if (!q || q.trim() === "") {
            return [];
        }
        return PostsRepository_1.default.search(q);
    }
    async getByAuthorId(authorId) {
        return PostsRepository_1.default.getByAuthorId(authorId);
    }
}
exports.default = new PostsService();
