"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPostSchema = exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
});
exports.updatePostSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    content: zod_1.z.string().min(1).optional(),
    authorId: zod_1.z.string().uuid().optional(),
});
exports.searchPostSchema = zod_1.z.object({
    q: zod_1.z.string().min(1),
});
