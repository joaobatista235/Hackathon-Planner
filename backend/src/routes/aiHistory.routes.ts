import { Router } from "express";
import AiHistoryController from "@/controllers/AiHistoryController";

const router = Router();


router.post(
  "/post",
  AiHistoryController.create
);


router.get(
  "/user/:userId",
  AiHistoryController.getHistory
);


router.delete(
  "/:id",
  AiHistoryController.delete
);


export default router;