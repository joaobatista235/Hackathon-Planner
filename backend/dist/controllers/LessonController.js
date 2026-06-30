"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("@/middlewares/asyncHandler");
const LessonService_1 = __importDefault(require("@/services/LessonService"));
class LessonController {
    constructor() {
        this.getAll = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
            const lessons = await LessonService_1.default.getAll();
            return res.json(lessons);
        });
        this.getById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            const lessonData = await LessonService_1.default.getById(id);
            return res.json(lessonData);
        });
        this.getByClassId = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const classId = req.params.classId;
            const lessons = await LessonService_1.default.getByLessonId(classId);
            return res.json(lessons);
        });
        this.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { title, description, classId, date } = req.body;
            const newLesson = await LessonService_1.default.create({
                title,
                description,
                date: date ? new Date(date) : new Date(),
                class: {
                    connect: {
                        id: classId,
                    },
                },
                author: {
                    connect: {
                        id: req.userId,
                    },
                },
            });
            return res.status(201).json(newLesson);
        });
        this.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            const { title, description, date } = req.body;
            const updatedLesson = await LessonService_1.default.update(id, {
                title,
                description,
                date: date ? new Date(date) : undefined,
            });
            return res.json(updatedLesson);
        });
        this.delete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            await LessonService_1.default.delete(id);
            return res.status(204).send();
        });
    }
}
exports.default = new LessonController();
