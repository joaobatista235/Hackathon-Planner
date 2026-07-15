"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("@/env");
const errorHandler_1 = require("@/middlewares/errorHandler");
const routes_1 = __importDefault(require("@/routes"));
const swagger_1 = require("@/swagger");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow any localhost/127.0.0.1 origin (all Vite ports) + no-origin (curl/Postman)
        if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS: origin not allowed — ${origin}`));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
// Serve uploaded files (PDFs, videos)
app.use("/uploads", express_1.default.static(path_1.default.resolve(process.cwd(), "uploads")));
app.use("/api", routes_1.default);
(0, swagger_1.setupSwagger)(app);
app.use(errorHandler_1.errorHandler);
if (env_1.env.NODE_ENV !== "test") {
    app.listen(env_1.env.PORT, () => {
        console.log(`Server running on port ${env_1.env.PORT}`);
    });
}
exports.default = app;
