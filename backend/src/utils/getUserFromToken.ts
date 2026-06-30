import type { Request } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/env";
import { AppError } from "@/middlewares/errorHandler";

interface JwtPayload {
  id: string;
}

export function getUserFromToken(req: Request): string {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não enviado", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return decoded.id;
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
