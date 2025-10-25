import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST(request) {
  try {
    console.log("📊 Sending monthly insights...");
    
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

    // Send monthly insights email
    const result = await convex.action(api.email.sendMonthlyInsights, {
      userId: userId,
      apiKey: process.env.RESEND_API_KEY,
    });

    if (result.success) {
      console.log(`✅ Monthly insights sent to ${userEmail}`);
      return NextResponse.json({
        success: true,
        message: "Monthly insights email sent successfully!",
        emailId: result.id,
        sentTo: userEmail
      });
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error("❌ Monthly insights error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: "Monthly insights endpoint is working. Use POST to send insights.",
    usage: "POST with { userId, userEmail } in body"
  });
}