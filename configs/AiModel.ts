import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  maxOutputTokens: 8192,
};

const codeGenerationConfig = {
  temperature: 0.7,
  topP: 0.95,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function generateAIResponse(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: generationConfig,
  });

  return response.text;
}

export async function generateAICode(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Generate to do app: Generate a Project in React.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: JSON.stringify({
              projectTitle: "Simple To-Do App",
            }),
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    config: codeGenerationConfig,
  });

  const result = response.text?.trim();

  if (!result) {
    throw new Error("Gemini returned an empty response");
  }

  return result;
}