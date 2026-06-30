"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("@/middlewares/errorHandler");
const BimesterPlanRepository_1 = __importDefault(require("@/repositories/BimesterPlanRepository"));
class BimesterPlanService {
    async getAll(authorId) {
        return BimesterPlanRepository_1.default.getAll(authorId);
    }
    async getById(id) {
        const plan = await BimesterPlanRepository_1.default.getById(id);
        if (!plan)
            throw new errorHandler_1.AppError("Planejamento não encontrado", 404);
        return plan;
    }
    async getByClassId(classId) {
        return BimesterPlanRepository_1.default.getByClassId(classId);
    }
    async create(data) {
        if (data.endsAt <= data.startsAt) {
            throw new errorHandler_1.AppError("A data de término deve ser posterior à data de início", 400);
        }
        return BimesterPlanRepository_1.default.create({
            title: data.title,
            goals: data.goals,
            startsAt: data.startsAt,
            endsAt: data.endsAt,
            class: { connect: { id: data.classId } },
            author: { connect: { id: data.authorId } },
        });
    }
    async update(id, data) {
        await this.getById(id);
        return BimesterPlanRepository_1.default.update(id, data);
    }
    async complete(id) {
        await this.getById(id);
        return BimesterPlanRepository_1.default.complete(id);
    }
    async delete(id) {
        await this.getById(id);
        return BimesterPlanRepository_1.default.delete(id);
    }
}
exports.default = new BimesterPlanService();
