"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AlertController_1 = __importDefault(require("@/controllers/AlertController"));
const authenticate_1 = require("@/middlewares/authenticate");
const validate_1 = require("@/middlewares/validate");
const alert_schema_1 = require("@/schemas/alert.schema");
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get("/", AlertController_1.default.getAll);
router.get("/pending", AlertController_1.default.getPending);
router.post("/", (0, validate_1.validate)(alert_schema_1.createAlertSchema), AlertController_1.default.create);
router.put("/:id", (0, validate_1.validate)(alert_schema_1.updateAlertSchema), AlertController_1.default.update);
router.patch("/:id/complete", AlertController_1.default.complete);
router.delete("/:id", AlertController_1.default.delete);
exports.default = router;
