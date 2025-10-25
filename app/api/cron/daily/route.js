import { NextResponse } from "next/server";

// This endpoint simulates a daily cron job
// In production, you would set up a real cron job or use Vercel Cron Jobs
// to call this endpoint daily

export async function GET() {
  try {
    console.log("🕐 Daily cron job triggered");
    
    // Call the automated emails endpoint for daily reminders
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/automated-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'daily'
      }),
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Daily cron job completed",
      timestamp: new Date().toISOString(),
      result: result
    });

  } catch (error) {
    console.error("❌ Daily cron job error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST() {
  return GET(); // Allow both GET and POST
}