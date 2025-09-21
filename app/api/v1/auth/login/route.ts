import { type NextRequest, NextResponse } from "next/server"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase-client"
import { saveUser } from "@/lib/firestore"
import { generateJWT } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    if (!auth) {
      return NextResponse.json({ error: "Authentication service not configured" }, { status: 503 })
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Save/update user in Firestore
    await saveUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLoginAt: new Date().toISOString(),
    })

    // Generate JWT token
    const token = await generateJWT({
      uid: user.uid,
      email: user.email,
    })

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      token,
    })
  } catch (error: any) {
    console.error("Login error:", error)

    let errorMessage = "Login failed"
    if (error.code === "auth/user-not-found") {
      errorMessage = "User not found"
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Invalid password"
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address"
    } else if (error.code === "auth/invalid-api-key") {
      errorMessage = "Authentication service not configured"
    }

    return NextResponse.json({ error: errorMessage }, { status: 401 })
  }
}
