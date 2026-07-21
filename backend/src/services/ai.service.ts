import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";
import AiHistoryService from "@/services/AiHistoryService";

const prisma = new PrismaClient();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy",
});

export class AIService {
  async chat(userId: string, message: string, classId?: string) {
    try {
      // Salva mensagem do usuário
      await AiHistoryService.create({
        userId,
        role: "USER",
        content: message,
      });

      let systemPrompt = `Você é o assistente virtual oficial do Hackathon Planner, um sistema completo de gestão escolar.
      Seu papel é atuar como um coordenador pedagógico prestativo, humanizado e muito direto.
      Você ajuda professores a planejar suas aulas, avaliações e organizar o ano letivo.
      Sua comunicação deve ser acolhedora, profissional e livre de jargões técnicos excessivos.

      ### Funcionalidades que o Hackathon Planner possui:
      - **Turmas**: Cadastro de turmas e disciplinas.
      - **Aulas**: Registro de aulas com título, data, descrição e **anexos (suporte a PDFs e Vídeos para material de apoio)**.
      - **Calendário**: Visão geral de datas importantes.
      - **Avaliações**: Criação de Provas e Trabalhos com prazos.
      - **Alertas**: Mural de avisos e lembretes urgentes.
      - **Planejamento Bimestral**: Definição de objetivos e metas para o bimestre.

      Sempre que fizer sentido, sugira ao professor o uso dessas ferramentas (ex: "Que tal criarmos uma Avaliação para esse tema?" ou "Sugiro anexar um vídeo a essa Aula!").
      Responda sempre em português e utilize formatação Markdown (negrito, listas, etc) para organizar suas ideias.`;

      if (classId) {
        const turma = await prisma.class.findUnique({
          where: { id: classId },
          include: {
            author: true,
            lessons: { orderBy: { date: "asc" } },
            assessments: { orderBy: { dueDate: "asc" } },
            bimesterPlans: true,
          },
        });

        if (turma) {
          systemPrompt += `\n\n### Contexto atual do Professor:
          - **Professor:** ${turma.author.name}
          - **Disciplina:** ${turma.subject}
          - **Turma:** ${turma.name}

          **Aulas já cadastradas:**
          ${JSON.stringify(turma.lessons.map(l => ({ titulo: l.title, data: l.date })), null, 2)}

          **Avaliações:**
          ${JSON.stringify(turma.assessments.map(a => ({ titulo: a.title, tipo: a.type })), null, 2)}
          `;
        }
      }

      const history = await AiHistoryService.getHistory(userId);
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = history.map((item: any) => ({
        role: item.role.toUpperCase() === "ASSISTANT" ? "model" : "user",
        parts: [{ text: item.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const aiMessage = response.text ?? "Não consegui formular uma resposta agora.";

      await AiHistoryService.create({
        userId,
        role: "ASSISTANT",
        content: aiMessage,
      });

      return {
        success: true,
        message: aiMessage,
      };

    } catch (error: any) {
      console.error("Erro no AIService:", error.message);
      throw new Error("Erro ao consultar assistente de IA. Tente novamente mais tarde.");
    }
  }
}