import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
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
