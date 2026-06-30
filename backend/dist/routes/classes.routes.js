"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClassController_1 = __importDefault(require("@/controllers/ClassController"));
const authenticate_1 = require("@/middlewares/authenticate");
const validate_1 = require("@/middlewares/validate");
const class_schema_1 = require("@/schemas/class.schema");
const router = (0, express_1.Router)();
router.get("/", ClassController_1.default.getAll);
/**
 * @swagger
 * /classes/author/{authorId}:
 *   get:
 *     summary: Retorna as turmas de um professor
 */
router.get("/author/:authorId", ClassController_1.default.getByTeacherId);
router.get("/:id", ClassController_1.default.getById);
router.post("/", authenticate_1.authenticate, (0, validate_1.validate)(class_schema_1.createClassSchema), ClassController_1.default.create);
router.put("/:id", (0, validate_1.validate)(class_schema_1.updateClassSchema), ClassController_1.default.update);
router.delete("/:id", ClassController_1.default.delete);
exports.default = router;
