import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/env";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não enviado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      role?: string;
    };
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
