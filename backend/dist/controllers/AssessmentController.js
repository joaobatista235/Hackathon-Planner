"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("@/middlewares/asyncHandler");
const AssessmentService_1 = __importDefault(require("@/services/AssessmentService"));
class AssessmentController {
    constructor() {
        this.getAll = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const assessments = await AssessmentService_1.default.getAll(req.userId);
            return res.json(assessments);
        });
        this.getById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const assessment = await AssessmentService_1.default.getById(req.params.id);
            return res.json(assessment);
        });
        this.getByClassId = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const assessments = await AssessmentService_1.default.getByClassId(req.params.classId);
            return res.json(assessments);
        });
        this.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { title, description, type, dueDate, classId } = req.body;
            const assessment = await AssessmentService_1.default.create({
                title,
                description,
                type,
                dueDate: new Date(dueDate),
                classId,
                authorId: req.userId,
            });
            return res.status(201).json(assessment);
        });
        this.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { title, description, type, dueDate, status } = req.body;
            const assessment = await AssessmentService_1.default.update(req.params.id, {
                title,
                description,
                type,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                status,
            });
            return res.json(assessment);
        });
        this.delete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            await AssessmentService_1.default.delete(req.params.id);
            return res.status(204).send();
        });
    }
}
exports.default = new AssessmentController();
