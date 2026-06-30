"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorHandler = errorHandler;
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
    if (err.message === "Token não enviado") {
        return res.status(401).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor" });
}
