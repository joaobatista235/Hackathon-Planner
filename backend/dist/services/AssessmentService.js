"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("@/middlewares/errorHandler");
const AssessmentRepository_1 = __importDefault(require("@/repositories/AssessmentRepository"));
class AssessmentService {
    async getAll(authorId) {
        return AssessmentRepository_1.default.getAll(authorId);
    }
    async getById(id) {
        const assessment = await AssessmentRepository_1.default.getById(id);
        if (!assessment)
            throw new errorHandler_1.AppError("Avaliação não encontrada", 404);
        return assessment;
    }
    async getByClassId(classId) {
        return AssessmentRepository_1.default.getByClassId(classId);
    }
    async create(data) {
        return AssessmentRepository_1.default.create({
            title: data.title,
            description: data.description,
            type: data.type,
            dueDate: data.dueDate,
            class: { connect: { id: data.classId } },
            author: { connect: { id: data.authorId } },
        });
    }
    async update(id, data) {
        await this.getById(id);
        return AssessmentRepository_1.default.update(id, data);
    }
    async delete(id) {
        await this.getById(id);
        return AssessmentRepository_1.default.delete(id);
    }
}
exports.default = new AssessmentService();
