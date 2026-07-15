"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/database/prisma"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("@/middlewares/errorHandler");
const UPLOAD_DIR = path_1.default.resolve(process.cwd(), "uploads");
class AttachmentService {
    async getByLesson(lessonId) {
        return prisma_1.default.attachment.findMany({
            where: { lessonId },
            orderBy: { createdAt: "asc" },
        });
    }
    async create(data) {
        const url = `/uploads/${data.filename}`;
        return prisma_1.default.attachment.create({
            data: { ...data, url },
        });
    }
    async delete(id) {
        const attachment = await prisma_1.default.attachment.findUnique({ where: { id } });
        if (!attachment)
            throw new errorHandler_1.AppError("Anexo não encontrado", 404);
        const filePath = path_1.default.join(UPLOAD_DIR, attachment.filename);
        await promises_1.default.unlink(filePath).catch(() => { });
        return prisma_1.default.attachment.delete({ where: { id } });
    }
}
exports.default = new AttachmentService();
