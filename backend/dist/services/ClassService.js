"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClassRepository_1 = __importDefault(require("@/repositories/ClassRepository"));
class ClassService {
    async getAll() {
        return ClassRepository_1.default.getAll();
    }
    async getById(id) {
        return ClassRepository_1.default.getById(id);
    }
    async create(data) {
        return ClassRepository_1.default.create(data);
    }
    async update(id, data) {
        return ClassRepository_1.default.update(id, data);
    }
    async delete(id) {
        return ClassRepository_1.default.delete(id);
    }
    async getByTeacherId(authorId) {
        return ClassRepository_1.default.getByTeacherId(authorId);
    }
}
exports.default = new ClassService();
