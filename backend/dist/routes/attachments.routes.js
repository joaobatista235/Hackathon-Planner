"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AttachmentController_1 = __importDefault(require("@/controllers/AttachmentController"));
const authenticate_1 = require("@/middlewares/authenticate");
const upload_1 = require("@/middlewares/upload");
const router = (0, express_1.Router)();
// GET /lessons/:lessonId/attachments
router.get("/lessons/:lessonId/attachments", authenticate_1.authenticate, AttachmentController_1.default.getByLesson);
// POST /lessons/:lessonId/attachments
router.post("/lessons/:lessonId/attachments", authenticate_1.authenticate, upload_1.upload.single("file"), AttachmentController_1.default.upload);
// DELETE /attachments/:id
router.delete("/attachments/:id", authenticate_1.authenticate, AttachmentController_1.default.delete);
exports.default = router;
