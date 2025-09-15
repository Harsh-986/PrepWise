// app/api/test-gemini/route.ts
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function GET() {
  try {
    console.log("Testing Gemini API...");
    
    const { text } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt: "Generate a simple JSON array with 3 interview questions for a React developer. Return only the JSON array, nothing else.",
    });
    
    console.log("Generated text:", text);
    
    // Try to parse it
    let parsed;
    try {
      parsed = JSON.parse(text.trim());
      console.log("Successfully parsed JSON:", parsed);
    } catch (e) {
      console.log("Failed to parse as JSON, raw text:", text);
    }
    
    return Response.json({
      success: true,
      message: "Gemini API is working",
      generatedText: text,
      parsed: parsed || null
    });
  } catch (error) {
    console.error("Gemini test error:", error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}