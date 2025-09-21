import { type NextRequest, NextResponse } from "next/server"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase-client"

export async function POST(request: NextRequest) {
  try {
    if (!auth) {
      return NextResponse.json({ error: "Authentication service not configured" }, { status: 503 })
    }

    await signOut(auth)

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error: any) {
    console.error("Logout error:", error)

    let errorMessage = "Logout failed"
    if (error.code === "auth/invalid-api-key") {
      errorMessage = "Authentication service not configured"
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
