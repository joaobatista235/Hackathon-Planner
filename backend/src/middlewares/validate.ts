import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type ValidationSource = "body" | "query" | "params";

export function validate(schema: ZodSchema, source: ValidationSource = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        message: "Dados inválidos",
        errors: result.error.flatten(),
      });
    }

    (req as unknown as Record<string, unknown>)[source] = result.data;
    next();
  };
}
