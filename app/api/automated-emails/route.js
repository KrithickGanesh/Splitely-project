import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
  try {
    console.log("🤖 Running automated email system...");
    
    const { type, force } = await request.json();
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY not configured"
      }, { status: 500 });
    }

    // Get all users
    const users = await convex.query(api.users.getAllUsers);
    console.log(`📧 Found ${users.length} users`);

    const results = {
      monthlyInsights: [],
      paymentReminders: [],
      errors: []
    };

    const today = new Date();
    const isFirstOfMonth = today.getDate() === 1;
    const shouldSendMonthly = force || isFirstOfMonth || type === 'monthly';
    const shouldSendDaily = force || type === 'daily' || type === 'reminders';

    for (const user of users) {
      try {
        // Send monthly insights (first of month or forced)
        if (shouldSendMonthly) {
          console.log(`📊 Sending monthly insights to ${user.email}`);
          const monthlyResult = await convex.action(api.email.sendMonthlyInsights, {
            userId: user._id,
            apiKey: process.env.RESEND_API_KEY,
          });
          
          results.monthlyInsights.push({
            user: user.email,
            success: monthlyResult.success,
            emailId: monthlyResult.id,
            error: monthlyResult.error
          });
        }

        // Send daily payment reminders (every day or forced)
        if (shouldSendDaily) {
          console.log(`💰 Checking payment reminders for ${user.email}`);
          const reminderResult = await convex.action(api.email.sendPaymentReminders, {
            userId: user._id,
            apiKey: process.env.RESEND_API_KEY,
          });
          
          results.paymentReminders.push({
            user: user.email,
            success: reminderResult.success,
            emailId: reminderResult.id,
            remindersCount: reminderResult.remindersCount || 0,
            message: reminderResult.message,
            error: reminderResult.error
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error processing user ${user.email}:`, error);
        results.errors.push({
          user: user.email,
          error: error.message
        });
      }
    }

    const summary = {
      totalUsers: users.length,
      monthlyInsightsSent: results.monthlyInsights.filter(r => r.success).length,
      paymentRemindersSent: results.paymentReminders.filter(r => r.success && r.remindersCount > 0).length,
      errors: results.errors.length,
      executedAt: new Date().toISOString(),
      type: type || 'auto',
      forced: !!force
    };

    console.log("🤖 Automated email summary:", summary);

    return NextResponse.json({
      success: true,
      summary,
      results,
      message: `Processed ${users.length} users. Sent ${summary.monthlyInsightsSent} monthly insights and ${summary.paymentRemindersSent} payment reminders.`
    });

  } catch (error) {
    console.error("❌ Automated email system error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET endpoint for status
export async function GET() {
  const today = new Date();
  return NextResponse.json({
    message: "Automated email system is ready",
    currentDate: today.toISOString(),
    isFirstOfMonth: today.getDate() === 1,
    usage: {
      runAll: "POST with { type: 'all', force: true }",
      monthlyOnly: "POST with { type: 'monthly' }",
      remindersOnly: "POST with { type: 'daily' }",
      forceAll: "POST with { force: true }"
    }
  });
}