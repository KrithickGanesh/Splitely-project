import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 Checking Gemini API configuration...");
    
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY not found in environment variables",
        solution: "Add GEMINI_API_KEY to your .env.local file"
      });
    }

    console.log("✅ API key found");
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try to list available models
    try {
      console.log("📋 Attempting to list available models...");
      const models = await genAI.listModels();
      
      const availableModels = models.map(model => ({
        name: model.name,
        displayName: model.displayName,
        description: model.description
      }));
      
      return NextResponse.json({
        success: true,
        message: "Gemini API is working!",
        apiKeyStatus: "Valid",
        availableModels: availableModels,
        recommendedModel: availableModels.find(m => 
          m.name.includes('gemini-1.5-flash') || 
          m.name.includes('gemini-pro')
        )?.name || availableModels[0]?.name
      });
      
    } catch (listError) {
      console.log("⚠️ Could not list models, trying direct test...");
      
      // If listing fails, try a simple generation test
      const testModels = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest", 
        "gemini-pro",
        "gemini-pro-latest"
      ];
      
      for (const modelName of testModels) {
        try {
          console.log(`🧪 Testing model: ${modelName}`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent("Hello");
          const response = await result.response.text();
          
          return NextResponse.json({
            success: true,
            message: "Gemini API is working!",
            apiKeyStatus: "Valid",
            workingModel: modelName,
            testResponse: response,
            note: "Could not list all models, but found a working one"
          });
          
        } catch (modelError) {
          console.log(`❌ Model ${modelName} failed:`, modelError.message);
          continue;
        }
      }
      
      return NextResponse.json({
        success: false,
        error: "No working Gemini models found",
        apiKeyStatus: "Valid but no accessible models",
        details: listError.message,
        solution: "Check your Gemini API key permissions or try a different key"
      });
    }
    
  } catch (error) {
    console.error("❌ Gemini check failed:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      apiKeyStatus: "Invalid or expired",
      solution: "Get a new API key from https://aistudio.google.com/app/apikey"
    }, { status: 500 });
  }
}