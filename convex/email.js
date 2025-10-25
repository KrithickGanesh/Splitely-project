import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { Resend } from "resend";

// Action to send email using Resend
export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.optional(v.string()),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const resend = new Resend(args.apiKey);

    try {
      const result = await resend.emails.send({
        from: "Splitely <delivered@resend.dev>",
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text,
      });

      console.log("Email sent successfully:", result);

      return { success: true, id: result.id };
    } catch (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }
  },
});

// Action to send monthly insights email
export const sendMonthlyInsights = action({
  args: {
    userId: v.id("users"),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const resend = new Resend(args.apiKey);

    try {
      // Get user data
      const user = await ctx.runQuery("users:get", { id: args.userId });
      if (!user) throw new Error("User not found");

      // Get user's groups and expenses for the month
      const userGroups = await ctx.runQuery("groups:getUserGroups", { userId: args.userId });
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      let totalSpent = 0;
      let totalOwed = 0;
      let totalOwing = 0;
      let expenseCount = 0;
      let groupsActive = 0;

      for (const group of userGroups) {
        const expenses = await ctx.runQuery("expenses:getGroupExpenses", { groupId: group._id });
        const monthlyExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense._creationTime);
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });

        expenseCount += monthlyExpenses.length;
        if (monthlyExpenses.length > 0) groupsActive++;

        for (const expense of monthlyExpenses) {
          if (expense.paidBy === args.userId) {
            totalSpent += expense.amount;
          }
          
          // Calculate what user owes or is owed
          const userShare = expense.amount / expense.splitBetween.length;
          if (expense.paidBy === args.userId) {
            totalOwed += (expense.amount - userShare);
          } else if (expense.splitBetween.includes(args.userId)) {
            totalOwing += userShare;
          }
        }
      }

      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #16a34a, #22c55e); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📊 Monthly Insights</h1>
            <p style="color: #dcfce7; margin: 10px 0 0 0; font-size: 16px;">${monthNames[currentMonth]} ${currentYear} Summary</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${user.name}! 👋</h2>
            <p style="color: #6b7280; line-height: 1.6;">Here's your monthly spending summary from Splitely:</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #dc2626;">$${totalSpent.toFixed(2)}</div>
              <div style="color: #6b7280; font-size: 14px;">Total Spent</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #16a34a;">$${totalOwed.toFixed(2)}</div>
              <div style="color: #6b7280; font-size: 14px;">You're Owed</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">$${totalOwing.toFixed(2)}</div>
              <div style="color: #6b7280; font-size: 14px;">You Owe</div>
            </div>
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${expenseCount}</div>
              <div style="color: #6b7280; font-size: 14px;">Expenses</div>
            </div>
          </div>

          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 25px;">
            <h3 style="color: #1f2937; margin-top: 0;">📈 Quick Stats</h3>
            <ul style="color: #6b7280; line-height: 1.8; padding-left: 20px;">
              <li>Active groups this month: <strong>${groupsActive}</strong></li>
              <li>Average expense: <strong>$${expenseCount > 0 ? (totalSpent / expenseCount).toFixed(2) : '0.00'}</strong></li>
              <li>Net balance: <strong style="color: ${(totalOwed - totalOwing) >= 0 ? '#16a34a' : '#dc2626'};">$${(totalOwed - totalOwing).toFixed(2)}</strong></li>
            </ul>
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              Keep tracking your expenses with Splitely! 
              <br>Next insights email: ${monthNames[(currentMonth + 1) % 12]} 1st
            </p>
          </div>
        </div>
      `;

      const result = await resend.emails.send({
        from: "Splitely Insights <delivered@resend.dev>",
        to: user.email,
        subject: `📊 Your ${monthNames[currentMonth]} Spending Insights - Splitely`,
        html: html,
      });

      console.log("Monthly insights email sent:", result);
      return { success: true, id: result.id };

    } catch (error) {
      console.error("Failed to send monthly insights:", error);
      return { success: false, error: error.message };
    }
  },
});

// Action to send daily payment reminders
export const sendPaymentReminders = action({
  args: {
    userId: v.id("users"),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const resend = new Resend(args.apiKey);

    try {
      // Get user data
      const user = await ctx.runQuery("users:get", { id: args.userId });
      if (!user) throw new Error("User not found");

      // Get all settlements where user owes money
      const settlements = await ctx.runQuery("settlements:getUserSettlements", { userId: args.userId });
      const pendingPayments = settlements.filter(settlement => 
        settlement.from === args.userId && settlement.status === "pending"
      );

      if (pendingPayments.length === 0) {
        return { success: true, message: "No pending payments" };
      }

      let totalOwing = 0;
      let remindersHtml = '';

      for (const payment of pendingPayments) {
        totalOwing += payment.amount;
        const toUser = await ctx.runQuery("users:get", { id: payment.to });
        const group = await ctx.runQuery("groups:get", { id: payment.groupId });
        
        remindersHtml += `
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; border-radius: 8px;">
            <div style="font-weight: bold; color: #92400e;">$${payment.amount.toFixed(2)} to ${toUser?.name || 'Unknown'}</div>
            <div style="color: #78350f; font-size: 14px;">Group: ${group?.name || 'Unknown'}</div>
            <div style="color: #78350f; font-size: 12px;">Due: ${new Date(payment._creationTime).toLocaleDateString()}</div>
          </div>
        `;
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #f59e0b, #fbbf24); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💰 Payment Reminder</h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">You have pending payments</p>
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${user.name}! 👋</h2>
            <p style="color: #6b7280; line-height: 1.6;">You have <strong>${pendingPayments.length}</strong> pending payment(s) totaling <strong style="color: #f59e0b;">$${totalOwing.toFixed(2)}</strong></p>
          </div>

          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 25px;">
            <h3 style="color: #1f2937; margin-top: 0;">📋 Pending Payments</h3>
            ${remindersHtml}
          </div>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              Don't forget to settle up with your friends! 
              <br>Log in to Splitely to mark payments as complete.
            </p>
          </div>
        </div>
      `;

      const result = await resend.emails.send({
        from: "Splitely Reminders <delivered@resend.dev>",
        to: user.email,
        subject: `💰 Payment Reminder - $${totalOwing.toFixed(2)} pending`,
        html: html,
      });

      console.log("Payment reminder email sent:", result);
      return { success: true, id: result.id, remindersCount: pendingPayments.length };

    } catch (error) {
      console.error("Failed to send payment reminder:", error);
      return { success: false, error: error.message };
    }
  },
});
