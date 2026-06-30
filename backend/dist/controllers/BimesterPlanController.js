"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("@/middlewares/asyncHandler");
const BimesterPlanService_1 = __importDefault(require("@/services/BimesterPlanService"));
class BimesterPlanController {
    constructor() {
        this.getAll = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const plans = await BimesterPlanService_1.default.getAll(req.userId);
            return res.json(plans);
        });
        this.getById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const plan = await BimesterPlanService_1.default.getById(req.params.id);
            return res.json(plan);
        });
        this.getByClassId = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const plans = await BimesterPlanService_1.default.getByClassId(req.params.classId);
            return res.json(plans);
        });
        this.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { title, goals, startsAt, endsAt, classId } = req.body;
            const plan = await BimesterPlanService_1.default.create({
                title,
                goals,
                startsAt: new Date(startsAt),
                endsAt: new Date(endsAt),
                classId,
                authorId: req.userId,
            });
            return res.status(201).json(plan);
        });
        this.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { title, goals, startsAt, endsAt, status } = req.body;
            const plan = await BimesterPlanService_1.default.update(req.params.id, {
                title,
                goals,
                startsAt: startsAt ? new Date(startsAt) : undefined,
                endsAt: endsAt ? new Date(endsAt) : undefined,
                status,
            });
            return res.json(plan);
        });
        this.complete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const plan = await BimesterPlanService_1.default.complete(req.params.id);
            return res.json(plan);
        });
        this.delete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            await BimesterPlanService_1.default.delete(req.params.id);
            return res.status(204).send();
        });
    }
}
exports.default = new BimesterPlanController();
