"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const client_1 = require("@prisma/client");
const genai_1 = require("@google/genai");
const prisma = new client_1.PrismaClient();
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
class AIService {
    async chat(message, classId) {
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
exports.AIService = AIService;
