import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "@/env";
import type { AuthRequest } from "@/middlewares/authenticate";

export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: "Token missing" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      role?: string;
    };

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin only" });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
