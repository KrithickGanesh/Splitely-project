import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST() {
  try {
    console.log("📧 Testing email system...");
    
    // Check authentication
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
    
    // Get current user
    const currentUser = await convex.query(api.users.getCurrentUser);
    console.log(`📧 Testing email for: ${currentUser.name} (${currentUser.email})`);

    // Send test email
    await convex.action(api.email.sendEmail, {
      to: currentUser.email,
      subject: `🧪 Test Email from Splitely`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #16a34a;">🧪 Test Email</h1>
          <p>Hi ${currentUser.name}!</p>
          <p>This is a test email to verify that the email system is working properly.</p>
          <p><strong>Your details:</strong></p>
          <ul>
            <li>Name: ${currentUser.name}</li>
            <li>Email: ${currentUser.email}</li>
            <li>User ID: ${currentUser._id}</li>
          </ul>
          <p>If you received this email, the system is working! 🎉</p>
        </div>
      `,
      apiKey: process.env.RESEND_API_KEY,
    });

    console.log(`✅ Test email sent to ${currentUser.email}`);

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      user: {
        name: currentUser.name,
        email: currentUser.email,
        userId: currentUser._id
      }
    });

  } catch (error) {
    console.error("❌ Test email error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}