import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST() {
  try {
    console.log("📧 Testing Payment Reminders System...");
    
    // 1. Get all users with outstanding debts
    const users = await convex.query(api.inngest.getUsersWithOutstandingDebts);
    console.log(`💰 Found ${users.length} users with outstanding debts`);

    if (users.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No users with outstanding debts found",
        suggestion: "Create some expenses between users to test payment reminders",
        instructions: [
          "1. Add expenses and split them with friends",
          "2. Make sure some people owe money to others", 
          "3. Come back and test again"
        ]
      });
    }

    const results = [];

    // 2. Process each user with debts
    for (const user of users) {
      console.log(`Processing ${user.name} - owes ${user.debts.length} people`);
      
      try {
        // Build debt table rows
        const debtRows = user.debts
          .map(debt => `
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px; text-align: left; font-weight: 500;">${debt.name}</td>
              <td style="padding: 12px; text-align: right; color: #dc2626; font-weight: 600;">₹${debt.amount.toFixed(2)}</td>
            </tr>
          `).join("");

        if (!debtRows) {
          results.push({ userId: user._id, name: user.name, skipped: true });
          continue;
        }

        const totalOwed = user.debts.reduce((sum, debt) => sum + debt.amount, 0);

        // Create beautiful HTML email
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #dc2626; margin: 0;">💳 Payment Reminder</h1>
              <p style="color: #6b7280; margin: 10px 0;">Splitely</p>
            </div>
            
            <div style="background: #fef2f2; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <p style="margin: 0 0 15px 0; color: #374151;">Hi ${user.name}! 👋</p>
              <p style="margin: 0 0 20px 0; color: #374151;">You have <strong>${user.debts.length}</strong> outstanding payment${user.debts.length > 1 ? 's' : ''} totaling <strong style="color: #dc2626;">₹${totalOwed.toFixed(2)}</strong>.</p>
            </div>
            
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin: 20px 0;">
              <div style="background: #f9fafb; padding: 15px; border-bottom: 1px solid #e5e7eb;">
                <h3 style="margin: 0; color: #374151;">Outstanding Balances</h3>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 12px; text-align: left; color: #6b7280; font-weight: 600;">You owe</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${debtRows}
                </tbody>
                <tfoot>
                  <tr style="background: #fef2f2; font-weight: bold;">
                    <td style="padding: 15px; color: #374151;">Total</td>
                    <td style="padding: 15px; text-align: right; color: #dc2626; font-size: 18px;">₹${totalOwed.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #16a34a; margin: 0 0 10px 0;">💡 Quick Settlement Tips</h3>
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li>Use mobile payment apps for quick transfers</li>
                <li>Settle up after group activities to avoid accumulation</li>
                <li>Set reminders to check your balances weekly</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Please settle up soon to keep your finances organized! 
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
                Manage your expenses at <a href="http://localhost:3000" style="color: #16a34a;">Splitely</a>
              </p>
            </div>
          </div>
        `;

        // Send the email
        await convex.action(api.email.sendEmail, {
          to: user.email,
          subject: `💳 Payment Reminder: You owe ₹${totalOwed.toFixed(2)} - Splitely`,
          html,
          apiKey: process.env.RESEND_API_KEY,
        });

        console.log(`✅ Payment reminder sent to ${user.email}`);
        
        results.push({ 
          userId: user._id, 
          name: user.name,
          email: user.email,
          success: true,
          debtCount: user.debts.length,
          totalOwed: totalOwed,
          debts: user.debts
        });
        
      } catch (err) {
        console.error(`❌ Error sending reminder to ${user.name}:`, err.message);
        results.push({
          userId: user._id,
          name: user.name,
          success: false,
          error: err.message,
        });
      }
    }

    // Return summary
    const summary = {
      processed: results.length,
      success: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      skipped: results.filter((r) => r.skipped).length,
      results: results
    };

    console.log("📊 Payment Reminders Summary:", summary);

    return NextResponse.json({
      success: true,
      message: "Payment reminders sent successfully!",
      summary,
      instructions: [
        "✅ Check email for payment reminder notifications",
        "✅ Users with debts received detailed balance breakdowns", 
        "✅ Beautiful HTML emails with settlement tips sent",
        "✅ Automatic reminders run daily at 10 AM UTC"
      ]
    });

  } catch (error) {
    console.error("❌ Payment Reminders Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}