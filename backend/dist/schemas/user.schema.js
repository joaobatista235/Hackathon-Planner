"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.email().optional(),
    password: zod_1.z.string().min(6).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(1),
});
