"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = chat;
const ai_service_1 = require("@/services/ai.service");
const aiService = new ai_service_1.AIService();
async function chat(req, res) {
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message || "Erro ao consultar a IA.",
        });
    }
}
