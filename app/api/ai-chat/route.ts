import { NextResponse } from "next/server";
import { generateAIResponse } from "@/configs/AiModel";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await generateAIResponse(prompt);

    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.error("AI Error:", error);

    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}