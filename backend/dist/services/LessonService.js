"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LessonRepository_1 = __importDefault(require("@/repositories/LessonRepository"));
class LessonService {
    async getAll() {
        return LessonRepository_1.default.getAll();
    }
    async getById(id) {
        return LessonRepository_1.default.getById(id);
    }
    async create(data) {
        return LessonRepository_1.default.create(data);
    }
    async update(id, data) {
        return LessonRepository_1.default.update(id, data);
    }
    async delete(id) {
        return LessonRepository_1.default.delete(id);
    }
    async getByLessonId(classId) {
        return LessonRepository_1.default.getByLessonId(classId);
    }
}
exports.default = new LessonService();
