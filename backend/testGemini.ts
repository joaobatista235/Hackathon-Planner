import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: "me diga o que é a gemini",
    });

    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}

main();