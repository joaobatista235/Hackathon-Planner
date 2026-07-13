import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";

const prisma = new PrismaClient();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});


export class AIService {
    
  async chat(message: string, classId?: string) {
    let prompt = message;

    if (classId) {
      const turma = await prisma.class.findUnique({
        where: {
          id: classId,
        },
        include: {
          author: true,
          lessons: {
            orderBy: {
              date: "asc",
            },
          },
          assessments: {
            orderBy: {
              dueDate: "asc",
            },
          },
          bimesterPlans: true,
        },
      });

      if (!turma) {
        throw new Error("Turma não encontrada.");
      }

      prompt = `
Você é um assistente especializado em planejamento escolar.

Professor:
${turma.author.name}

Disciplina:
${turma.subject}

Turma:
${turma.name}

Aulas cadastradas:

${JSON.stringify(turma.lessons, null, 2)}

Avaliações:

${JSON.stringify(turma.assessments, null, 2)}

Planejamentos bimestrais:

${JSON.stringify(turma.bimesterPlans, null, 2)}

Solicitação do professor:

${message}

Responda em português utilizando Markdown.
`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    return response.text;
  }
}