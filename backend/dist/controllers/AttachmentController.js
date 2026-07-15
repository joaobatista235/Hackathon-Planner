"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = require("@/middlewares/asyncHandler");
const AttachmentService_1 = __importDefault(require("@/services/AttachmentService"));
const errorHandler_1 = require("@/middlewares/errorHandler");
class AttachmentController {
    constructor() {
        this.getByLesson = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const attachments = await AttachmentService_1.default.getByLesson(req.params.lessonId);
            return res.json(attachments);
        });
        this.upload = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            if (!req.file)
                throw new errorHandler_1.AppError("Nenhum arquivo enviado", 400);
            const attachment = await AttachmentService_1.default.create({
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                lessonId: req.params.lessonId,
            });
            return res.status(201).json(attachment);
        });
        this.delete = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            await AttachmentService_1.default.delete(req.params.id);
            return res.status(204).send();
        });
    }
}
exports.default = new AttachmentController();
