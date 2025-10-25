import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function POST() {
  try {
    console.log("🔄 Refreshing balance calculations...");
    
    // Get fresh balance data
    const balances = await convex.query(api.dashboard.getUserBalances);
    
    // Check for inconsistencies
    const issues = [];
    
    if (balances.youAreOwed > 0 && balances.oweDetails.youAreOwedBy.length === 0) {
      issues.push({
        type: "youAreOwed",
        amount: balances.youAreOwed,
        peopleCount: balances.oweDetails.youAreOwedBy.length,
        message: "You are owed money but no people in the list"
      });
    }
    
    if (balances.youOwe > 0 && balances.oweDetails.youOwe.length === 0) {
      issues.push({
        type: "youOwe", 
        amount: balances.youOwe,
        peopleCount: balances.oweDetails.youOwe.length,
        message: "You owe money but no people in the list"
      });
    }
    
    return NextResponse.json({
      success: true,
      balances: balances,
      issues: issues,
      fixed: issues.length === 0,
      message: issues.length === 0 
        ? "✅ Balance calculations are consistent!" 
        : `⚠️ Found ${issues.length} balance calculation issue(s)`,
      instructions: issues.length > 0 ? [
        "The backend balance calculation has been updated",
        "Refresh your dashboard page to see the fix",
        "If issues persist, there may be data inconsistencies in your expenses"
      ] : [
        "Your balance calculations are working correctly",
        "No action needed"
      ]
    });

  } catch (error) {
    console.error("❌ Balance refresh error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}