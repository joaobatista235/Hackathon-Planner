"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.coerce.number().default(3000),
    DATABASE_URL: zod_1.z.url(),
    JWT_SECRET: zod_1.z.string().min(1),
});
const _env = envSchema.safeParse(process.env);
if (_env.success === false) {
    console.error("❌ Invalid environment variables:", zod_1.z.treeifyError(_env.error));
    throw new Error("Invalid environment variables.");
}
exports.env = _env.data;
