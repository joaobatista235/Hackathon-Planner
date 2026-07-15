import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

import AiHistoryService from "@/services/AiHistoryService";

const prisma = new PrismaClient();

const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});


export class GroqService {


  async chat(
    userId: string,
    message: string,
    classId?: string,
  ) {

    try {

      // Salva mensagem do usuário
      await AiHistoryService.create({
        userId,
        role: "USER",
        content: message,
      });


      let prompt = message;


      // Caso tenha turma selecionada, monta contexto
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


        const aulas = turma.lessons.map((lesson) => ({

          titulo: lesson.title,
          data: lesson.date,
          descricao: lesson.description,

        }));


        const avaliacoes = turma.assessments.map((assessment) => ({

          titulo: assessment.title,
          dataEntrega: assessment.dueDate,
          tipo: assessment.type,

        }));


        prompt = `

Você é um assistente especialista em planejamento escolar.


Professor:
${turma.author.name}


Disciplina:
${turma.subject}


Turma:
${turma.name}


Aulas existentes:
${JSON.stringify(aulas, null, 2)}


Avaliações:
${JSON.stringify(avaliacoes, null, 2)}


Planejamentos:
${JSON.stringify(turma.bimesterPlans, null, 2)}


Solicitação do professor:
${message}


Regras:

- Responda em português.
- Utilize Markdown.
- Seja objetivo.
- Gere sugestões práticas para professores.

`;

      }


      // Busca histórico do usuário
      const history =
        await AiHistoryService.getHistory(userId);



      const historyMessages: Array<{ role: "user" | "assistant"; content: string }> =
        history.map(item => ({
          role: item.role.toUpperCase() === "ASSISTANT" ? "assistant" : "user",
          content: item.content,
        }));

      const response =
        await ai.chat.completions.create({

          model: "llama-3.3-70b-versatile",

          temperature: 0.7,


          messages: [

            {
              role: "system",

              content:
                "Você é um assistente de IA para professores e planejamento escolar.",
            },


            ...historyMessages,

            {
              role: "user",

              content: prompt,

            },

          ],

        });



      const aiMessage =
        response.choices[0].message.content ?? "";



      // Salva resposta da IA
      await AiHistoryService.create({

        userId,

        role: "ASSISTANT",

        content: aiMessage,

      });



      return {

        success: true,

        message: aiMessage,

      };


    } catch(error:any) {


      console.error(
        "Erro no GroqService:",
        error.message
      );


      throw new Error(
        "Erro ao consultar assistente de IA."
      );

    }

  }

}