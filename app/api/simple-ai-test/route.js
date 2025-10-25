import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🤖 Testing AI with simple data...");

    // Initialize Gemini AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try different model names to find what works (gemini-pro-latest confirmed working)
    const modelNames = [
      "gemini-pro-latest",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
      "gemini-1.5-pro-latest", 
      "gemini-1.5-pro"
    ];
    
    let model;
    let modelName;
    let lastError;
    
    for (const name of modelNames) {
      try {
        console.log(`🔍 Trying model: ${name}`);
        model = genAI.getGenerativeModel({ model: name });
        
        // Test with a simple prompt to see if it works
        const testResult = await model.generateContent("Say hello");
        await testResult.response.text(); // This will throw if the model doesn't work
        
        modelName = name;
        console.log(`✅ Model ${name} works!`);
        break;
      } catch (e) {
        console.log(`❌ Model ${name} failed:`, e.message);
        lastError = e;
        continue;
      }
    }
    
    if (!model) {
      throw new Error(`No working Gemini model found. Last error: ${lastError?.message}`);
    }

    // Sample expense data for testing
    const sampleExpenses = [
      { description: "Pizza dinner", amount: 45.50, category: "Food & Drink" },
      { description: "Uber ride", amount: 18.75, category: "Transportation" },
      { description: "Movie tickets", amount: 32.00, category: "Entertainment" },
      { description: "Groceries", amount: 67.30, category: "Groceries" },
      { description: "Coffee", amount: 12.50, category: "Coffee" }
    ];

    const totalSpent = sampleExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Create a simple prompt
    const prompt = `
You are a financial advisor. Analyze this spending data and provide helpful insights:

Expenses:
${sampleExpenses.map(e => `- ${e.description}: ₹${e.amount} (${e.category})`).join('\n')}

Total Spent: ₹${totalSpent}

Please provide:
1. A brief spending summary
2. Top spending category
3. One money-saving tip
4. One positive comment

Keep it friendly and under 200 words.
    `;

    console.log(`🧠 Using model: ${modelName}`);
    console.log("📝 Sending prompt to AI...");

    // Call the AI
    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiText = response.text();

    console.log("✅ AI Response received!");
    console.log("Response preview:", aiText.substring(0, 100) + "...");

    return NextResponse.json({
      success: true,
      model: modelName,
      prompt: prompt,
      aiResponse: aiText,
      sampleData: {
        expenses: sampleExpenses,
        totalSpent: totalSpent
      },
      message: "AI test completed successfully!"
    });

  } catch (error) {
    console.error("❌ AI Test Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Simple AI Test Endpoint",
    instructions: "Send a POST request to test AI functionality",
    example: "curl -X POST http://localhost:3000/api/simple-ai-test"
  });
}