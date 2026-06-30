"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = isAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("@/env");
function isAdmin(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({ error: "Token missing" });
    }
    const token = auth.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (decoded.role !== "ADMIN") {
            return res.status(403).json({ error: "Admin only" });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    }
    catch {
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
}
