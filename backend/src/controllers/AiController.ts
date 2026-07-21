import { Request, Response } from "express";
import { AIService } from "@/services/ai.service";

const aiService = new AIService();

class AiController {
  async chat(req: Request, res: Response) {
    try {
      const { message, userId, classId } = req.body;

      if (!message || !userId) {
        return res.status(400).json({
          message: "O campo 'message' e 'userId' são obrigatórios.",
        });
      }

      const response = await aiService.chat(userId, message, classId);

      return res.status(200).json(response);
    } catch (error: any) {
      console.error("Erro no AiController:", error.message);
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}

export const chat = new AiController().chat;