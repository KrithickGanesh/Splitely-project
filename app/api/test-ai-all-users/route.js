import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST() {
  try {
    console.log("🚀 Testing AI Insights for ALL Users (regardless of expenses)...");
    
    // Initialize Gemini AI with working model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const modelNames = [
      "gemini-pro-latest",
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

    // Get ALL users (not just those with expenses)
    const allUsers = await convex.query(api.users.getAllUsers);
    console.log(`📊 Found ${allUsers.length} total users for testing`);

    if (allUsers.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No users found in the system",
        instructions: [
          "1. Make sure users are signed up",
          "2. Check user authentication",
          "3. Try again"
        ]
      });
    }

    const results = [];

    // Process each user with rate limiting
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      console.log(`Processing user ${i + 1}/${allUsers.length}: ${user.name} (${user.email})`);
      
      // Add delay between requests to avoid rate limiting (free tier: 2 per minute)
      if (i > 0) {
        console.log("⏳ Waiting 35 seconds to avoid rate limiting...");
        await new Promise(resolve => setTimeout(resolve, 35000)); // 35 second delay
      }
      
      try {
        // Get user's expenses (if any)
        let expenses = [];
        try {
          expenses = await convex.query(api.inngest.getUserMonthlyExpenses, { 
            userId: user._id 
          });
        } catch (e) {
          console.log(`No expenses found for ${user.name}, using sample data`);
        }

        let totalSpent = 0;
        let categories = {};
        let topCategory = ["General", 0];

        if (expenses.length > 0) {
          // Use real expense data
          totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
          categories = expenses.reduce((cats, e) => {
            cats[e.category ?? "Other"] = (cats[e.category ?? "Other"] ?? 0) + e.amount;
            return cats;
          }, {});
          topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
        } else {
          // Use sample data for testing
          const sampleExpenses = [
            { description: "Coffee", amount: 150, category: "Food & Drink" },
            { description: "Lunch", amount: 300, category: "Food & Drink" },
            { description: "Movie tickets", amount: 500, category: "Entertainment" }
          ];
          totalSpent = 950;
          categories = { "Food & Drink": 450, "Entertainment": 500 };
          topCategory = ["Food & Drink", 450];
          expenses = sampleExpenses;
        }

        // Create AI prompt
        const prompt = `
You are a friendly financial advisor. Provide helpful insights for this user's spending:

EXPENSE DATA:
Total Expenses: ₹${totalSpent.toFixed(2)}
Number of Expenses: ${expenses.length}

EXPENSES BY CATEGORY:
${Object.entries(categories)
  .sort(([,a], [,b]) => b - a)
  .map(([cat, amount]) => `• ${cat}: ₹${amount.toFixed(2)} (${((amount/totalSpent)*100).toFixed(1)}%)`)
  .join('\n')}

Please provide a friendly analysis with:
1. **Monthly Overview** - Brief summary
2. **Top Category** - Insights about ${topCategory[0]}
3. **Money-Saving Tips** - 2 specific suggestions
4. **Positive Feedback** - Something encouraging

Keep it conversational and under 250 words. Use HTML formatting.
        `.trim();

        console.log(`🧠 Generating AI insights for ${user.name}...`);
        
        // Call Gemini AI
        const aiResponse = await model.generateContent(prompt);
        const htmlBody = aiResponse.response.text();

        console.log(`✅ AI generated insights for ${user.name}`);

        // Send email with insights
        await convex.action(api.email.sendEmail, {
          to: user.email,
          subject: `💡 Your Financial Insights (Test) - Splitely`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #16a34a; margin: 0;">💡 Your Financial Insights</h1>
                <p style="color: #6b7280; margin: 10px 0;">Test Report • Powered by AI • Splitely</p>
              </div>
              
              <div style="background: #f9fafb; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #16a34a;">
                <p style="margin: 0 0 15px 0; color: #374151;">Hi ${user.name}! 👋</p>
                <p style="margin: 0 0 20px 0; color: #374151;">Here's your personalized spending analysis:</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
                  ${htmlBody}
                </div>
              </div>
              
              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #16a34a; margin: 0 0 10px 0;">📊 Quick Stats</h3>
                <p style="margin: 5px 0; color: #374151;"><strong>Total Spent:</strong> ₹${totalSpent.toFixed(2)}</p>
                <p style="margin: 5px 0; color: #374151;"><strong>Number of Expenses:</strong> ${expenses.length}</p>
                <p style="margin: 5px 0; color: #374151;"><strong>Top Category:</strong> ${topCategory[0]} (₹${topCategory[1].toFixed(2)})</p>
              </div>
              
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  🧪 <strong>This is a test email</strong> - Testing AI insights functionality for all users.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  This analysis was generated by Splitely's AI assistant for testing purposes.
                </p>
              </div>
            </div>
          `,
          apiKey: process.env.RESEND_API_KEY,
        });

        console.log(`📧 Test email sent to ${user.email}`);
        
        results.push({ 
          userId: user._id, 
          name: user.name,
          email: user.email,
          success: true,
          expenseCount: expenses.length,
          totalSpent: totalSpent,
          topCategory: topCategory[0],
          aiPreview: htmlBody.substring(0, 150) + "...",
          isTestData: expenses.length === 0
        });
        
      } catch (err) {
        console.error(`❌ Error processing ${user.name}:`, err.message);
        results.push({
          userId: user._id,
          name: user.name,
          success: false,
          error: err.message,
        });
      }
    }

    // Return comprehensive summary
    const summary = {
      modelUsed: modelName,
      processed: results.length,
      success: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results: results
    };

    console.log("🎯 Test AI Insights Summary:", summary);

    return NextResponse.json({
      success: true,
      message: "Test AI insights sent to all users!",
      summary,
      instructions: [
        "✅ Check all user emails for test AI insights",
        "✅ Each user received personalized analysis", 
        "✅ Users without expenses got sample data",
        "✅ Rate limiting applied to avoid quota issues"
      ]
    });

  } catch (error) {
    console.error("❌ Test AI Insights Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      solution: "Check API quotas and try again in a few minutes"
    }, { status: 500 });
  }
}