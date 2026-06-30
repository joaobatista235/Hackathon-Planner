"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LessonController_1 = __importDefault(require("@/controllers/LessonController"));
const authenticate_1 = require("@/middlewares/authenticate");
const validate_1 = require("@/middlewares/validate");
const lesson_schema_1 = require("@/schemas/lesson.schema");
const router = (0, express_1.Router)();
router.get("/", LessonController_1.default.getAll);
/**
 * @swagger
 * /lessons/class/{classId}:
 *   get:
 *     summary: Retorna as aulas de uma turma
 */
router.get("/class/:classId", LessonController_1.default.getByClassId);
router.get("/:id", LessonController_1.default.getById);
router.post("/", authenticate_1.authenticate, (0, validate_1.validate)(lesson_schema_1.createLessonSchema), LessonController_1.default.create);
router.put("/:id", (0, validate_1.validate)(lesson_schema_1.updateLessonSchema), LessonController_1.default.update);
router.delete("/:id", LessonController_1.default.delete);
exports.default = router;
