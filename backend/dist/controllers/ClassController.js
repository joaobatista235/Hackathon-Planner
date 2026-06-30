"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("@/middlewares/asyncHandler");
const ClassService_1 = __importDefault(require("@/services/ClassService"));
class ClassController {
    constructor() {
        this.getAll = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
            const classes = await ClassService_1.default.getAll();
            return res.json(classes);
        });
        this.getById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            const classData = await ClassService_1.default.getById(id);
            return res.json(classData);
        });
        this.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const { name, subject } = req.body;
            const newClass = await ClassService_1.default.create({
                name,
                subject,
                author: {
                    connect: {
                        id: req.userId,
                    },
                },
            });
            return res.status(201).json(newClass);
        });
        this.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            const { name, subject } = req.body;
            const updatedClass = await ClassService_1.default.update(id, { name, subject });
            return res.json(updatedClass);
        });
        this.delete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            await ClassService_1.default.delete(id);
            return res.status(204).send();
        });
        this.getByTeacherId = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const authorId = req.params.authorId;
            const classes = await ClassService_1.default.getByTeacherId(authorId);
            return res.json(classes);
        });
    }
}
exports.default = new ClassController();
