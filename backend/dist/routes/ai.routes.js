"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AiController_1 = require("@/controllers/AiController");
const router = (0, express_1.Router)();
router.post("/chat", AiController_1.chat);
exports.default = router;
