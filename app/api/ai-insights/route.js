import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST() {
  try {
    console.log("🚀 Starting Personal AI Insights Generation...");
    
    // Check authentication - get current user
    const authResult = await auth();
    const { userId } = authResult;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Authentication required"
      }, { status: 401 });
    }

    // Set authentication for Convex
    const token = await authResult.getToken({ template: "convex" });
    convex.setAuth(token);
    
    // Initialize Gemini AI with working model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const modelNames = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-pro",
      "gemini-pro-latest"
    ];
    
    let model;
    let modelName;
    
    for (const name of modelNames) {
      try {
        model = genAI.getGenerativeModel({ model: name });
        const testResult = await model.generateContent("Hello");
        await testResult.response.text();
        modelName = name;
        console.log(`✅ Using model: ${name}`);
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!model) {
      throw new Error("No working Gemini model found");
    }

    // 1. Get current user info
    const currentUser = await convex.query(api.users.getCurrentUser);
    console.log(`📊 Generating insights for: ${currentUser.name} (${currentUser.email})`);
    console.log(`📊 User ID: ${currentUser._id}`);

    // 2. Get current user's expenses
    console.log(`🔍 Looking for expenses for user: ${currentUser._id}`);
    const expenses = await convex.query(api.inngest.getUserMonthlyExpenses, { 
      userId: currentUser._id 
    });
    
    console.log(`📊 Found ${expenses?.length || 0} expenses`);
    
    if (!expenses?.length) {
      console.log("❌ No expenses found for user");
      return NextResponse.json({
        success: false,
        error: "No expenses found for your account",
        debug: {
          userId: currentUser._id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          expenseCount: expenses?.length || 0
        },
        instructions: [
          "1. Go to /dashboard",
          "2. Click 'Add expense'", 
          "3. Add some expenses with different categories",
          "4. Come back and try again"
        ]
      });
    }

    console.log(`Found ${expenses.length} expenses for ${currentUser.name}`);

    // 3. Build expense data for AI
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categories = expenses.reduce((cats, e) => {
      cats[e.category ?? "Other"] = (cats[e.category ?? "Other"] ?? 0) + e.amount;
      return cats;
    }, {});

    const topCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)[0];

    // 4. Create detailed AI prompt
    const prompt = `
You are a friendly financial advisor analyzing someone's monthly expenses. Provide helpful, encouraging insights.

EXPENSE DATA:
Total Expenses: ₹${totalSpent.toFixed(2)}
Number of Expenses: ${expenses.length}

EXPENSES BY CATEGORY:
${Object.entries(categories)
  .sort(([,a], [,b]) => b - a)
  .map(([cat, amount]) => `• ${cat}: ₹${amount.toFixed(2)} (${((amount/totalSpent)*100).toFixed(1)}%)`)
  .join('\n')}

INDIVIDUAL EXPENSES:
${expenses.slice(0, 10).map(e => 
  `• ${e.description}: ₹${e.amount.toFixed(2)} (${e.category || 'Other'})`
).join('\n')}
${expenses.length > 10 ? `... and ${expenses.length - 10} more expenses` : ''}

Please provide a friendly, encouraging analysis with:

1. **Monthly Overview** - Brief summary of their spending
2. **Top Spending Category** - Insights about their biggest expense category
3. **Spending Patterns** - What you notice about their habits
4. **Money-Saving Tips** - 2-3 specific, actionable suggestions
5. **Positive Feedback** - Something they're doing well

Keep it conversational, encouraging, and under 300 words. Use HTML formatting for email.
    `.trim();

    console.log(`🧠 Generating AI insights for ${currentUser.name}...`);
    
    // 5. Call Gemini AI
    const aiResponse = await model.generateContent(prompt);
    const htmlBody = aiResponse.response.text();

    console.log(`✅ AI generated insights for ${currentUser.name}`);

    // 6. Send email to current user
    console.log(`📧 Sending email to: ${currentUser.email}`);
    console.log(`📧 Using API key: ${process.env.RESEND_API_KEY ? 'Present' : 'Missing'}`);
    
    await convex.action(api.email.sendEmail, {
      to: currentUser.email,
      subject: `💡 Your Personal Financial Insights - Splitely`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #16a34a; margin: 0;">💡 Your Personal Financial Insights</h1>
            <p style="color: #6b7280; margin: 10px 0;">Powered by AI • Splitely</p>
          </div>
          
          <div style="background: #f9fafb; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <p style="margin: 0 0 15px 0; color: #374151;">Hi ${currentUser.name}! 👋</p>
            <p style="margin: 0 0 20px 0; color: #374151;">Here's your personalized spending analysis:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
              ${htmlBody}
            </div>
          </div>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin: 0 0 10px 0;">📊 Your Quick Stats</h3>
            <p style="margin: 5px 0; color: #374151;"><strong>Total Spent:</strong> ₹${totalSpent.toFixed(2)}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Number of Expenses:</strong> ${expenses.length}</p>
            <p style="margin: 5px 0; color: #374151;"><strong>Top Category:</strong> ${topCategory[0]} (₹${topCategory[1].toFixed(2)})</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              This analysis was generated by Splitely's AI assistant to help you make better financial decisions.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
              Keep tracking your expenses at <a href="https://splitely.vercel.app" style="color: #16a34a;">Splitely</a>
            </p>
          </div>
        </div>
      `,
      apiKey: process.env.RESEND_API_KEY,
    });

    console.log(`📧 Personal insights email sent to ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      message: "Your personal AI insights have been sent to your email!",
      user: {
        name: currentUser.name,
        email: currentUser.email,
        expenseCount: expenses.length,
        totalSpent: totalSpent,
        topCategory: topCategory[0],
        aiPreview: htmlBody.substring(0, 150) + "..."
      },
      modelUsed: modelName,
      instructions: [
        "✅ Check your email for personalized AI insights",
        "✅ The AI analyzed your real expense data", 
        "✅ You received actionable financial recommendations",
        "✅ Your spending patterns have been identified"
      ]
    });

  } catch (error) {
    console.error("❌ Personal AI Insights Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      solution: "Check the diagnostic page at /check-ai"
    }, { status: 500 });
  }
}