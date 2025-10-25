import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 Debugging email configuration...");
    
    // Check if Resend API key exists
    const hasApiKey = !!process.env.RESEND_API_KEY;
    const apiKeyLength = process.env.RESEND_API_KEY?.length || 0;
    const apiKeyPrefix = process.env.RESEND_API_KEY?.substring(0, 8) || 'None';
    
    console.log(`API Key exists: ${hasApiKey}`);
    console.log(`API Key length: ${apiKeyLength}`);
    console.log(`API Key prefix: ${apiKeyPrefix}`);

    // Test direct Resend API call
    let resendTest = null;
    if (hasApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Splitely <delivered@resend.dev>',
            to: ['unnamedmonster7@gmail.com'], // Your correct email for testing
            subject: '🧪 Direct Resend API Test',
            html: `
              <h1>Direct Resend API Test</h1>
              <p>This email was sent directly through Resend API to test the configuration.</p>
              <p>If you receive this, the Resend API key is working!</p>
            `,
          }),
        });

        const result = await response.json();
        resendTest = {
          success: response.ok,
          status: response.status,
          result: result
        };
        
        console.log('Resend API test result:', resendTest);
      } catch (error) {
        resendTest = {
          success: false,
          error: error.message
        };
      }
    }

    return NextResponse.json({
      success: true,
      debug: {
        hasApiKey,
        apiKeyLength,
        apiKeyPrefix,
        resendTest,
        environment: {
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV
        }
      }
    });

  } catch (error) {
    console.error("❌ Email debug error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}