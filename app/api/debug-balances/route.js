import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function GET() {
  try {
    console.log("🔍 Debugging balance calculation...");
    
    // Get the balance data
    const balances = await convex.query(api.dashboard.getUserBalances);
    
    // Get raw expenses and settlements for debugging
    const allExpenses = await convex.query(api.expenses.getExpensesBetweenUsers, {
      userId: "jd715zq1vyy8k17qtxxw6017gn7sw7xz" // Replace with actual user ID
    });
    
    return NextResponse.json({
      success: true,
      debug: {
        balances: balances,
        rawData: {
          youOwe: balances.youOwe,
          youAreOwed: balances.youAreOwed,
          totalBalance: balances.totalBalance,
          oweDetails: balances.oweDetails,
        },
        analysis: {
          youAreOwedAmount: balances.youAreOwed,
          youAreOwedByCount: balances.oweDetails.youAreOwedBy.length,
          youOweAmount: balances.youOwe, 
          youOweToCount: balances.oweDetails.youOwe.length,
          issue: balances.youAreOwed > 0 && balances.oweDetails.youAreOwedBy.length === 0 
            ? "FOUND THE BUG: You are owed money but no people in the list!"
            : "No issue detected"
        }
      }
    });

  } catch (error) {
    console.error("❌ Debug error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}