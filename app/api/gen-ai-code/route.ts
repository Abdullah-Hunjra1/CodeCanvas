import { NextResponse } from "next/server";
import { generateAICode } from "@/configs/AiModel";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await generateAICode(prompt);

    const parsedResult = JSON.parse(result);

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Code generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate code" },
      { status: 500 }
    );
  }
}