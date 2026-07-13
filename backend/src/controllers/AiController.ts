import { Request, Response } from "express";
import { AIService } from "@/services/ai.service";

const aiService = new AIService();

export async function chat(req: Request, res: Response) {
  try {
    const { message, classId } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "O campo 'message' é obrigatório.",
      });
    }

    const response = await aiService.chat(message, classId);

    return res.status(200).json({
      response,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Erro ao consultar a IA.",
    });
  }
}