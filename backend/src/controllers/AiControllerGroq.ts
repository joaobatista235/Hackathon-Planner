import { Request, Response } from "express";
import { GroqService } from "@/services/ai.service.groq";

const groqService = new GroqService();

export class GroqController {

  async chat(req: Request, res: Response) {

    try {

      const {
        userId,
        message,
        
      } = req.body;


      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "O campo userId é obrigatório."
        });
      }


      if (!message) {
        return res.status(400).json({
          success: false,
          message: "O campo message é obrigatório."
        });
      }


      const response = await groqService.chat(
        userId,
        message,
        
      );


      return res.status(200).json(response);


    } catch (error: any) {

      console.error(
        "Erro no controller Groq:",
        error.message
      );


      return res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }

}