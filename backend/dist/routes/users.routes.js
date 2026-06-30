"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("@/controllers/UserController"));
const validate_1 = require("@/middlewares/validate");
const user_schema_1 = require("@/schemas/user.schema");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags:
 *       - Users
 */
router.post("/login", (0, validate_1.validate)(user_schema_1.loginSchema), UserController_1.default.login);
router.post("/", (0, validate_1.validate)(user_schema_1.createUserSchema), UserController_1.default.create);
router.get("/", UserController_1.default.getAll);
/**
 * @swagger
 * /users/email/{email}:
 *   get:
 *     summary: Retorna um usuário pelo email
 */
router.get("/email/:email", UserController_1.default.getByEmail);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 */
router.get("/:id", UserController_1.default.getById);
router.put("/:id", (0, validate_1.validate)(user_schema_1.updateUserSchema), UserController_1.default.update);
router.delete("/:id", UserController_1.default.delete);
exports.default = router;
