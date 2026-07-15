import { Router } from "express";
import { GroqController } from "@/controllers/AiControllerGroq";

const router = Router();
const controller = new GroqController();

router.post(
  "/chat",
  (req, res) =>
    controller.chat(req, res)
);
export default router;