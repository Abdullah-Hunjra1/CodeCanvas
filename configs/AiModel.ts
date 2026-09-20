import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  maxOutputTokens: 8192,
};

export async function generateAIResponse(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: generationConfig,
  });

  return response.text;
}