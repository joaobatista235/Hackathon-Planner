"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("@/middlewares/errorHandler");
const AlertRepository_1 = __importDefault(require("@/repositories/AlertRepository"));
class AlertService {
    async getAll(authorId) {
        return AlertRepository_1.default.getAll(authorId);
    }
    async getPending(authorId) {
        return AlertRepository_1.default.getPending(authorId);
    }
    async create(data) {
        return AlertRepository_1.default.create({
            title: data.title,
            message: data.message,
            priority: data.priority,
            dueDate: data.dueDate,
            author: { connect: { id: data.authorId } },
        });
    }
    async update(id, data) {
        const alert = await AlertRepository_1.default.getById(id);
        if (!alert)
            throw new errorHandler_1.AppError("Alerta não encontrado", 404);
        return AlertRepository_1.default.update(id, data);
    }
    async complete(id) {
        const alert = await AlertRepository_1.default.getById(id);
        if (!alert)
            throw new errorHandler_1.AppError("Alerta não encontrado", 404);
        return AlertRepository_1.default.complete(id);
    }
    async delete(id) {
        const alert = await AlertRepository_1.default.getById(id);
        if (!alert)
            throw new errorHandler_1.AppError("Alerta não encontrado", 404);
        return AlertRepository_1.default.delete(id);
    }
    /**
     * Gera alertas automáticos para um evento com data de vencimento.
     * URGENT: <= 24h | NEAR: <= 7d | OVERDUE: vencido.
     * Não duplica se já existe alerta com mesmo título e authorId.
     */
    static computePriority(dueDate) {
        const now = new Date();
        const diffMs = dueDate.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        if (diffMs < 0)
            return "OVERDUE";
        if (diffHours <= 24)
            return "URGENT";
        return "NEAR";
    }
}
exports.default = new AlertService();
