import { Request, Response } from "express";
import AiHistoryService from "@/services/AiHistoryService";

class AiHistoryController {

  async create(req: Request, res: Response) {
    try {

      const { userId, role, content } = req.body;

      const message = await AiHistoryService.create({
        userId,
        role,
        content,
      });

      return res.status(201).json(message);

    } catch (error:any) {

      return res.status(500).json({
        message: error.message,
      });

    }
  }


 async getHistory(
  req: Request<{ userId: string }>,
  res: Response
) {
  try {

    const { userId } = req.params;

    const history = await AiHistoryService.getHistory(userId);

    return res.json(history);

  } catch (error:any) {

    return res.status(500).json({
      message: error.message,
    });

  }
}


  async delete(req: Request, res: Response) {
    try {

      const { id } = req.params;

      await AiHistoryService.delete(Number(id));

      return res.json({
        message: "Mensagem removida com sucesso",
      });

    } catch (error:any) {

      return res.status(500).json({
        message: error.message,
      });

    }
  }

}

export default new AiHistoryController();