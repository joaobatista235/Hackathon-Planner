"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("@/middlewares/asyncHandler");
const AlertService_1 = __importDefault(require("@/services/AlertService"));
class AlertController {
    constructor() {
        this.getAll = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const alerts = await AlertService_1.default.getAll(req.userId);
            return res.json(alerts);
        });
        this.getPending = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const alerts = await AlertService_1.default.getPending(req.userId);
            return res.json(alerts);
        });
        this.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { title, message, priority, dueDate } = req.body;
            const alert = await AlertService_1.default.create({
                title,
                message,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                authorId: req.userId,
            });
            return res.status(201).json(alert);
        });
        this.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { title, message, priority, dueDate } = req.body;
            const alert = await AlertService_1.default.update(req.params.id, {
                title,
                message,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined,
            });
            return res.json(alert);
        });
        this.complete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const alert = await AlertService_1.default.complete(req.params.id);
            return res.json(alert);
        });
        this.delete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            await AlertService_1.default.delete(req.params.id);
            return res.status(204).send();
        });
    }
}
exports.default = new AlertController();
