import { NextResponse } from "next/server";

// This endpoint simulates a monthly cron job
// In production, you would set up a real cron job or use Vercel Cron Jobs
// to call this endpoint on the 1st of every month

export async function GET() {
  try {
    console.log("📅 Monthly cron job triggered");
    
    // Call the automated emails endpoint for monthly insights
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/automated-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'monthly'
      }),
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Monthly cron job completed",
      timestamp: new Date().toISOString(),
      result: result
    });

  } catch (error) {
    console.error("❌ Monthly cron job error:", error);
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