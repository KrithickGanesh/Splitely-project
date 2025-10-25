import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function GET() {
  try {
    console.log("📋 Getting all users for selection...");
    
    // Get all users from the database
    const users = await convex.query(api.users.getAllUsers);
    
    return NextResponse.json({
      success: true,
      users: users,
      count: users.length
    });

  } catch (error) {
    console.error("❌ Error getting users:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}