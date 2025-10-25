import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
  try {
    console.log("💰 Sending payment reminders...");
    
    const { userId, userEmail } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID required"
      }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY not configured"
      }, { status: 500 });
    }

    // Send payment reminder email
    const result = await convex.action(api.email.sendPaymentReminders, {
      userId: userId,
      apiKey: process.env.RESEND_API_KEY,
    });

    if (result.success) {
      console.log(`✅ Payment reminder sent to ${userEmail}`);
      return NextResponse.json({
        success: true,
        message: result.message || "Payment reminder email sent successfully!",
        emailId: result.id,
        sentTo: userEmail,
        remindersCount: result.remindersCount || 0
      });
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error("❌ Payment reminder error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: "Payment reminders endpoint is working. Use POST to send reminders.",
    usage: "POST with { userId, userEmail } in body"
  });
}