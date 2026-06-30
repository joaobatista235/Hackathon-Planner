"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromToken = getUserFromToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("@/env");
const errorHandler_1 = require("@/middlewares/errorHandler");
function getUserFromToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new errorHandler_1.AppError("Token não enviado", 401);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        return decoded.id;
    }
    catch {
        throw new errorHandler_1.AppError("Token inválido ou expirado", 401);
    }
}
