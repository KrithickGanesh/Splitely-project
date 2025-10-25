import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST() {
  try {
    console.log("📧 Testing direct email sending...");
    
    // Check authentication
    const authResult = await auth();
    const { userId } = authResult;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Authentication required"
      }, { status: 401 });
    }

    // Set authentication for Convex and get current user
    const token = await authResult.getToken({ template: "convex" });
    convex.setAuth(token);
    
    const currentUser = await convex.query(api.users.getCurrentUser);
    console.log(`📧 Current user: ${currentUser.name} (${currentUser.email})`);

    // Check if Resend API key exists
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY not found in environment variables"
      }, { status: 500 });
    }

    console.log(`📧 Using API key: ${process.env.RESEND_API_KEY.substring(0, 8)}...`);

    // Send email directly using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Splitely <delivered@resend.dev>',
        to: currentUser.email, // Use signed-in user's email
        subject: '🧪 Direct Email Test - Splitely',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #16a34a;">🧪 Direct Email Test</h1>
            <p>This email was sent directly using the Resend API to test email delivery.</p>
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Sent at: ${new Date().toISOString()}</li>
              <li>User ID: ${userId}</li>
              <li>User Name: ${currentUser.name}</li>
              <li>User Email: ${currentUser.email}</li>
              <li>Method: Direct Resend API call</li>
            </ul>
            <p>If you receive this email, the Resend configuration is working! 🎉</p>
          </div>
        `,
      }),
    });

    const result = await response.json();
    
    console.log(`📧 Resend API response:`, result);
    console.log(`📧 Response status: ${response.status}`);

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Direct email sent successfully!",
        emailId: result.id,
        sentTo: currentUser.email,
        debug: {
          status: response.status,
          result: result
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to send email",
        sentTo: currentUser.email,
        resendLimitation: currentUser.email !== 'unnamedmonster7@gmail.com' 
          ? "⚠️ Resend testing mode only allows emails to unnamedmonster7@gmail.com" 
          : null,
        debug: {
          status: response.status,
          result: result
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error("❌ Direct email test error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}