"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AssessmentController_1 = __importDefault(require("@/controllers/AssessmentController"));
const authenticate_1 = require("@/middlewares/authenticate");
const validate_1 = require("@/middlewares/validate");
const assessment_schema_1 = require("@/schemas/assessment.schema");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get("/", AssessmentController_1.default.getAll);
router.get("/class/:classId", AssessmentController_1.default.getByClassId);
router.get("/:id", AssessmentController_1.default.getById);
router.post("/", (0, validate_1.validate)(assessment_schema_1.createAssessmentSchema), AssessmentController_1.default.create);
router.put("/:id", (0, validate_1.validate)(assessment_schema_1.updateAssessmentSchema), AssessmentController_1.default.update);
router.delete("/:id", AssessmentController_1.default.delete);
exports.default = router;
