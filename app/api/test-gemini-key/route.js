import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔑 Testing Gemini API Key...");
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY environment variable not found"
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try the working model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
    
    // Simple test
    const result = await model.generateContent("Hello, respond with just 'Hi'");
    const response = await result.response.text();
    
    return NextResponse.json({
      success: true,
      message: "Gemini API key is working!",
      model: "gemini-pro-latest",
      response: response,
      keyLength: process.env.GEMINI_API_KEY.length
    });
    
  } catch (error) {
    console.error("❌ Gemini API Key Test Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString(),
      keyExists: !!process.env.GEMINI_API_KEY,
      keyLength: process.env.GEMINI_API_KEY?.length || 0
    }, { status: 500 });
  }
}